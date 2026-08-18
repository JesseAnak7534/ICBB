const crypto = require('crypto');

/**
 * MTN Mobile Money — Collections API client.
 *
 * How a payment actually works, because it shapes everything below:
 *
 *   1. We call RequestToPay with the payer's number and the amount.
 *   2. MTN pushes a prompt to that handset.
 *   3. The payer approves it by entering their MoMo PIN.
 *   4. We poll the status until it settles as SUCCESSFUL or FAILED.
 *
 * Step 3 cannot be skipped or automated — no API can debit a subscriber's
 * wallet without their PIN, by design. "Automatic" here means the site raises
 * the prompt and confirms the result on its own, with nobody reading SMS
 * receipts or typing transaction IDs.
 *
 * A payment is only ever marked paid on a SUCCESSFUL status returned by MTN.
 * Nothing the browser reports is trusted.
 */

const isProduction = process.env.MOMO_ENVIRONMENT === 'production';

const BASE_URL = isProduction
  ? 'https://proxy.momoapi.mtn.com'
  : 'https://sandbox.momodeveloper.mtn.com';

// The sandbox only settles in EUR; live Ghanaian collections are in GHS.
const DEFAULT_CURRENCY = isProduction ? 'GHS' : 'EUR';

const config = {
  apiUser: process.env.MOMO_API_USER,
  apiKey: process.env.MOMO_API_KEY,
  subscriptionKey: process.env.MOMO_SUBSCRIPTION_KEY,
  targetEnvironment: isProduction ? 'mtnghana' : 'sandbox',
  callbackUrl: process.env.MOMO_CALLBACK_URL
};

/** True when the collections API is configured well enough to call. */
const isConfigured = () =>
  Boolean(config.apiUser && config.apiKey && config.subscriptionKey);

/**
 * Normalise a Ghanaian number to the MSISDN form MTN expects: country code,
 * no plus, no spaces. 0559759592 -> 233559759592.
 */
const toMsisdn = (raw) => {
  const digits = String(raw || '').replace(/\D/g, '');

  if (digits.startsWith('233')) return digits;
  if (digits.startsWith('0')) return `233${digits.slice(1)}`;
  if (digits.length === 9) return `233${digits}`;

  return digits;
};

/** Ghanaian mobile numbers are 10 digits beginning 02x or 05x. */
const isValidGhanaNumber = (raw) => {
  const digits = String(raw || '').replace(/\D/g, '');
  const local = digits.startsWith('233') ? `0${digits.slice(3)}` : digits;
  return /^0[235][0-9]{8}$/.test(local);
};

class MomoError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = 'MomoError';
    this.status = status;
    this.body = body;
  }
}

/** OAuth token for the collections product. Short-lived, so cached briefly. */
let tokenCache = { token: null, expiresAt: 0 };

const getAccessToken = async () => {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const basic = Buffer.from(`${config.apiUser}:${config.apiKey}`).toString('base64');

  const response = await fetch(`${BASE_URL}/collection/token/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Ocp-Apim-Subscription-Key': config.subscriptionKey
    }
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok || !body.access_token) {
    throw new MomoError('Could not authenticate with MTN MoMo', {
      status: response.status,
      body
    });
  }

  // Refresh a minute early rather than racing the expiry.
  const ttl = (Number(body.expires_in) || 3600) * 1000;
  tokenCache = { token: body.access_token, expiresAt: Date.now() + ttl - 60000 };

  return tokenCache.token;
};

/**
 * Ask MTN to prompt the payer for approval.
 *
 * @returns {Promise<{referenceId: string, msisdn: string, amount: string, currency: string}>}
 *          The referenceId is what the status is later polled against, so it
 *          must be stored against the enrolment.
 */
const requestToPay = async ({ amount, currency, phone, externalId, payerMessage, payeeNote }) => {
  if (!isConfigured()) {
    throw new MomoError('MTN MoMo is not configured on this server');
  }

  if (!isValidGhanaNumber(phone)) {
    throw new MomoError('That does not look like a Ghanaian mobile number');
  }

  const token = await getAccessToken();
  const referenceId = crypto.randomUUID();
  const msisdn = toMsisdn(phone);
  const payCurrency = currency || DEFAULT_CURRENCY;

  const response = await fetch(`${BASE_URL}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': config.targetEnvironment,
      'Ocp-Apim-Subscription-Key': config.subscriptionKey,
      'Content-Type': 'application/json',
      ...(config.callbackUrl ? { 'X-Callback-Url': config.callbackUrl } : {})
    },
    body: JSON.stringify({
      amount: String(amount),
      currency: payCurrency,
      externalId: String(externalId),
      payer: { partyIdType: 'MSISDN', partyId: msisdn },
      payerMessage: (payerMessage || 'ICBB course fee').slice(0, 160),
      payeeNote: (payeeNote || 'ICBB training').slice(0, 160)
    })
  });

  // A successful request-to-pay returns 202 Accepted with an empty body.
  if (response.status !== 202) {
    const body = await response.text().catch(() => '');
    throw new MomoError('MTN MoMo rejected the payment request', {
      status: response.status,
      body
    });
  }

  return { referenceId, msisdn, amount: String(amount), currency: payCurrency };
};

/**
 * Poll one payment.
 *
 * @returns {Promise<{status: 'PENDING'|'SUCCESSFUL'|'FAILED', reason?: string, raw: object}>}
 */
const getPaymentStatus = async (referenceId) => {
  if (!isConfigured()) {
    throw new MomoError('MTN MoMo is not configured on this server');
  }

  const token = await getAccessToken();

  const response = await fetch(
    `${BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Target-Environment': config.targetEnvironment,
        'Ocp-Apim-Subscription-Key': config.subscriptionKey
      }
    }
  );

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new MomoError('Could not read the payment status', {
      status: response.status,
      body
    });
  }

  // MTN returns PENDING, SUCCESSFUL or FAILED. Anything else is treated as
  // still pending rather than optimistically settled.
  const status = ['SUCCESSFUL', 'FAILED'].includes(body.status) ? body.status : 'PENDING';

  return {
    status,
    reason: body.reason,
    financialTransactionId: body.financialTransactionId,
    raw: body
  };
};

module.exports = {
  isConfigured,
  requestToPay,
  getPaymentStatus,
  toMsisdn,
  isValidGhanaNumber,
  MomoError,
  DEFAULT_CURRENCY,
  isProduction
};
