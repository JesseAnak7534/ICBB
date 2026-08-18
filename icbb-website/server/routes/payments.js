const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ServiceRequest = require('../models/ServiceRequest');
const { sendEmail } = require('../utils/email');

const { protect, authorize } = require('../middleware/auth');

// MTN MoMo payee details. Kept in the environment so the account can be changed
// without a code deploy.
const MOMO_CONFIG = {
  accountName: process.env.MOMO_ACCOUNT_NAME || '',
  accountNumber: process.env.MOMO_ACCOUNT_NUMBER || '',
  network: process.env.MOMO_NETWORK || 'MTN Ghana'
};

// @route   POST /api/payments/initiate
// @desc    Initiate MTN MoMo payment
// @access  Public
router.post('/initiate', [
  body('requestId').notEmpty().withMessage('Request ID is required'),
  body('momoNumber').matches(/^0[0-9]{9}$/).withMessage('Invalid phone number format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { requestId, momoNumber } = req.body;

    // Find the service request
    const serviceRequest = await ServiceRequest.findOne({ requestId });
    
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    if (serviceRequest.payment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this request'
      });
    }

    // Update payment info
    serviceRequest.payment.momoNumber = momoNumber;
    serviceRequest.payment.status = 'processing';
    await serviceRequest.save();

    // In production, this would integrate with MTN MoMo API
    // For now, we return payment instructions
    res.json({
      success: true,
      message: 'Payment initiated',
      data: {
        requestId: serviceRequest.requestId,
        amount: serviceRequest.payment.amount,
        currency: serviceRequest.payment.currency,
        payTo: {
          name: MOMO_CONFIG.accountName,
          number: MOMO_CONFIG.accountNumber,
          network: MOMO_CONFIG.network
        },
        instructions: [
          'Open your MTN MoMo app or dial *170#',
          'Select "Transfer Money" or "Send Money"',
          `Enter the amount: GHS ${serviceRequest.payment.amount}`,
          `Enter recipient number: ${MOMO_CONFIG.accountNumber}`,
          'Confirm the transaction',
          'Use your request ID as reference: ' + serviceRequest.requestId
        ]
      }
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating payment'
    });
  }
});

// @route   POST /api/payments/confirm
// @desc    Client reports that they have sent the MoMo transfer.
//          This ONLY records the claim — it does not mark the payment received.
//          An admin must verify it against the actual MoMo account.
// @access  Public
router.post('/confirm', [
  body('requestId').notEmpty().withMessage('Request ID is required'),
  body('transactionId').trim().notEmpty().withMessage('Transaction ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { requestId, transactionId } = req.body;

    const serviceRequest = await ServiceRequest.findOne({ requestId });

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    if (serviceRequest.payment.status === 'completed') {
      return res.json({
        success: true,
        message: 'Payment already confirmed',
        data: {
          requestId: serviceRequest.requestId,
          status: serviceRequest.status,
          paymentStatus: serviceRequest.payment.status
        }
      });
    }

    serviceRequest.payment.status = 'awaiting-verification';
    serviceRequest.payment.transactionId = transactionId;
    serviceRequest.payment.claimedAt = new Date();
    await serviceRequest.save();

    // Tell the admin there is something to verify.
    try {
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `Payment awaiting verification - ${serviceRequest.requestId}`,
          html: `
            <h2>Payment Claim Submitted</h2>
            <p>A client reports they have paid. Check the MoMo account before releasing any work.</p>
            <p><strong>Request ID:</strong> ${serviceRequest.requestId}</p>
            <p><strong>Client:</strong> ${serviceRequest.clientName} (${serviceRequest.clientEmail})</p>
            <p><strong>Service:</strong> ${serviceRequest.serviceType}</p>
            <p><strong>Amount expected:</strong> GHS ${serviceRequest.payment.amount}</p>
            <p><strong>Transaction ID given:</strong> ${transactionId}</p>
            <br>
            <p>Verify it in the admin dashboard to mark this request as paid.</p>
          `
        });
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    res.json({
      success: true,
      message: 'Thank you. We are verifying your payment and will email you once confirmed.',
      data: {
        requestId: serviceRequest.requestId,
        status: serviceRequest.status,
        paymentStatus: serviceRequest.payment.status
      }
    });

  } catch (error) {
    console.error('Payment claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment'
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Admin confirms the money actually arrived, marking the request paid.
// @access  Private/Admin
router.post('/verify', protect, authorize('admin'), [
  body('requestId').notEmpty().withMessage('Request ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { requestId, transactionId } = req.body;

    const serviceRequest = await ServiceRequest.findOne({ requestId });

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    serviceRequest.payment.status = 'completed';
    if (transactionId) {
      serviceRequest.payment.transactionId = transactionId;
    }
    serviceRequest.payment.paidAt = new Date();
    serviceRequest.payment.verifiedAt = new Date();
    serviceRequest.payment.verifiedBy = req.user._id;
    serviceRequest.status = 'received';
    await serviceRequest.save();

    // Confirmation emails, now that the payment is genuinely verified.
    try {
      await sendEmail({
        to: serviceRequest.clientEmail,
        subject: `Payment Confirmed - ICBB Request ${serviceRequest.requestId}`,
        html: `
          <h2>Payment Confirmation</h2>
          <p>Dear ${serviceRequest.clientName},</p>
          <p>Your payment has been confirmed for service request <strong>${serviceRequest.requestId}</strong>.</p>
          <p><strong>Amount:</strong> GHS ${serviceRequest.payment.amount}</p>
          <p><strong>Transaction ID:</strong> ${serviceRequest.payment.transactionId || 'N/A'}</p>
          <p>We have received your request and will begin processing it shortly.</p>
          <p>You will receive an email notification when your results are ready.</p>
          <br>
          <p>Thank you for choosing ICBB!</p>
          <p>Best regards,<br>ICBB Data Analysis Team</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    res.json({
      success: true,
      message: 'Payment verified',
      data: {
        requestId: serviceRequest.requestId,
        status: serviceRequest.status,
        paymentStatus: serviceRequest.payment.status
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
});

// @route   GET /api/payments/status/:requestId
// @desc    Get payment status
// @access  Public
router.get('/status/:requestId', async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findOne({ 
      requestId: req.params.requestId 
    });

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    res.json({
      success: true,
      data: {
        requestId: serviceRequest.requestId,
        paymentStatus: serviceRequest.payment.status,
        amount: serviceRequest.payment.amount,
        currency: serviceRequest.payment.currency,
        paidAt: serviceRequest.payment.paidAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment status'
    });
  }
});

// @route   POST /api/payments/callback
// @desc    MTN MoMo callback endpoint (for production integration)
// @access  Public (secured by MoMo)
router.post('/callback', async (req, res) => {
  try {
    // This would handle actual MTN MoMo callbacks in production
    console.log('MoMo callback received:', req.body);
    
    // Process the callback and update payment status
    // Implementation depends on MTN MoMo API response format
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
