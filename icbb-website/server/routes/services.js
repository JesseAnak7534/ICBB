const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ServiceRequest = require('../models/ServiceRequest');
const upload = require('../middleware/upload');
const { sendEmail } = require('../utils/email');

// Service pricing (configurable)
const servicePricing = {
  'data-cleaning': { base: 500, name: 'Data Cleaning Only' },
  'data-analysis': { base: 700, name: 'Data Analysis Only' },
  'data-cleaning-analysis': { base: 1000, name: 'Data Cleaning + Full Analysis' },
  'statistical-consulting': { base: 600, name: 'Statistical Consulting' },
  'bioinformatics-analysis': { base: 1200, name: 'Bioinformatics Analysis' },
  'paper-review': { base: 500, name: 'Research Paper Review' }
};

// @route   GET /api/services/types
// @desc    Get available service types with pricing
// @access  Public
router.get('/types', (req, res) => {
  const services = Object.entries(servicePricing).map(([key, value]) => ({
    id: key,
    name: value.name,
    basePrice: value.base,
    currency: 'GHS'
  }));
  
  res.json({
    success: true,
    services
  });
});

// @route   POST /api/services/request
// @desc    Submit a new service request
// @access  Public
router.post('/request', 
  upload.array('files', 10),
  [
    body('clientName').trim().notEmpty().withMessage('Name is required'),
    body('clientEmail').isEmail().withMessage('Valid email is required'),
    body('serviceType').isIn(Object.keys(servicePricing)).withMessage('Invalid service type'),
    body('description').trim().notEmpty().withMessage('Description is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { 
        clientName, 
        clientEmail, 
        institution, 
        phone,
        serviceType, 
        description, 
        deadline,
        additionalNotes 
      } = req.body;

      // Process uploaded files
      const uploadedFiles = req.files ? req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype
      })) : [];

      // Calculate price
      const service = servicePricing[serviceType];
      const amount = service.base;

      // Generate unique request ID
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const requestId = `ICBB-${year}${month}-${random}`;

      // Create service request
      const serviceRequest = await ServiceRequest.create({
        requestId,
        clientName,
        clientEmail,
        institution,
        phone,
        serviceType,
        description,
        deadline: deadline ? new Date(deadline) : null,
        additionalNotes,
        uploadedFiles,
        payment: {
          amount,
          currency: 'GHS',
          status: 'pending'
        },
        status: 'pending-payment'
      });

      res.status(201).json({
        success: true,
        message: 'Service request created successfully',
        data: {
          requestId: serviceRequest.requestId,
          serviceName: service.name,
          amount,
          currency: 'GHS'
        }
      });

    } catch (error) {
      console.error('Service request error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating service request'
      });
    }
  }
);

// @route   GET /api/services/request/:requestId
// @desc    Get service request status
// @access  Public (with requestId)
router.get('/request/:requestId', async (req, res) => {
  try {
    const request = await ServiceRequest.findOne({ 
      requestId: req.params.requestId 
    }).select('-uploadedFiles.path -completedFiles.path');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service request'
    });
  }
});

// @route   GET /api/services/track
// @desc    Track service request by email and requestId
// @access  Public
router.get('/track', async (req, res) => {
  try {
    const { email, requestId } = req.query;

    if (!email || !requestId) {
      return res.status(400).json({
        success: false,
        message: 'Email and request ID are required'
      });
    }

    const request = await ServiceRequest.findOne({ 
      clientEmail: email.toLowerCase(),
      requestId: requestId
    }).select('-uploadedFiles.path -adminNotes');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    res.json({
      success: true,
      data: {
        requestId: request.requestId,
        serviceType: request.serviceType,
        status: request.status,
        paymentStatus: request.payment.status,
        createdAt: request.createdAt,
        completedFiles: request.completedFiles.length > 0
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking service request'
    });
  }
});

module.exports = router;
