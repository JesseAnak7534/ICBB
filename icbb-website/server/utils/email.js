const nodemailer = require('nodemailer');

/**
 * Outgoing email.
 *
 * Sending needs SMTP_HOST, SMTP_USER and SMTP_PASS. Without them nothing can
 * be delivered, and this module says so loudly rather than quietly returning
 * success — the previous version reported `{ success: true }` when it had no
 * transporter at all, so every caller believed mail had gone out while nothing
 * ever left the server.
 */

const isConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let warned = false;

const createTransporter = () => {
  if (!isConfigured()) {
    if (!warned) {
      console.warn(
        '[email] SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS). ' +
        'No email will be delivered. Messages are logged instead.'
      );
      warned = true;
    }
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_PORT) === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
};

/**
 * @returns {Promise<{sent: boolean, reason?: string, messageId?: string}>}
 *          `sent` is only true when a mail server accepted the message.
 */
exports.sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[email] NOT SENT (SMTP not configured) -> ${to} :: ${subject}`);
    return { sent: false, reason: 'SMTP is not configured on this server' };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || String(html).replace(/<[^>]*>/g, '')
    });

    console.log(`[email] sent -> ${to} :: ${subject} (${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    // Deliberately not rethrown: a failed notification must not fail the
    // registration or payment that triggered it. It is logged so the failure
    // is visible instead of invisible.
    console.error(`[email] FAILED -> ${to} :: ${subject} :: ${error.message}`);
    return { sent: false, reason: error.message };
  }
};

exports.isConfigured = isConfigured;
