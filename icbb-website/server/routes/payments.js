const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ServiceRequest = require('../models/ServiceRequest');
const { sendEmail } = require('../utils/email');

// MTN MoMo Configuration
const MOMO_CONFIG = {
  accountName: 'Jesse Azebiik Anak',
  accountNumber: '0559759592',
  network: 'MTN Ghana'
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
// @desc    Confirm payment (manual confirmation by admin or client)
// @access  Public
router.post('/confirm', [
  body('requestId').notEmpty().withMessage('Request ID is required'),
  body('transactionId').notEmpty().withMessage('Transaction ID is required')
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

    // Update payment status
    serviceRequest.payment.status = 'completed';
    serviceRequest.payment.transactionId = transactionId;
    serviceRequest.payment.paidAt = new Date();
    serviceRequest.status = 'received';
    await serviceRequest.save();

    // Send confirmation emails
    try {
      // Email to client
      await sendEmail({
        to: serviceRequest.clientEmail,
        subject: `Payment Confirmed - ICBB Request ${serviceRequest.requestId}`,
        html: `
          <h2>Payment Confirmation</h2>
          <p>Dear ${serviceRequest.clientName},</p>
          <p>Your payment has been confirmed for service request <strong>${serviceRequest.requestId}</strong>.</p>
          <p><strong>Amount:</strong> GHS ${serviceRequest.payment.amount}</p>
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p>We have received your request and will begin processing it shortly.</p>
          <p>You will receive an email notification when your results are ready.</p>
          <br>
          <p>Thank you for choosing ICBB!</p>
          <p>Best regards,<br>ICBB Data Analysis Team</p>
        `
      });

      // Email to admin
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Service Request Received - ${serviceRequest.requestId}`,
        html: `
          <h2>New Service Request</h2>
          <p><strong>Request ID:</strong> ${serviceRequest.requestId}</p>
          <p><strong>Client:</strong> ${serviceRequest.clientName}</p>
          <p><strong>Email:</strong> ${serviceRequest.clientEmail}</p>
          <p><strong>Service:</strong> ${serviceRequest.serviceType}</p>
          <p><strong>Amount Paid:</strong> GHS ${serviceRequest.payment.amount}</p>
          <p><strong>Description:</strong> ${serviceRequest.description}</p>
          <br>
          <p>Please log in to the admin dashboard to view and process this request.</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        requestId: serviceRequest.requestId,
        status: serviceRequest.status,
        paymentStatus: serviceRequest.payment.status
      }
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment'
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
