const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ServiceRequest = require('../models/ServiceRequest');
const ContactSubmission = require('../models/ContactSubmission');
const TrainingRegistration = require('../models/TrainingRegistration');
const upload = require('../middleware/upload');
const { sendEmail } = require('../utils/email');

// All admin routes require authentication
router.use(protect);
router.use(authorize('admin', 'staff'));

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests,
      totalContacts,
      newContacts,
      totalRegistrations
    ] = await Promise.all([
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ status: { $in: ['pending-payment', 'received'] } }),
      ServiceRequest.countDocuments({ status: 'in-progress' }),
      ServiceRequest.countDocuments({ status: 'completed' }),
      ContactSubmission.countDocuments(),
      ContactSubmission.countDocuments({ status: 'new' }),
      TrainingRegistration.countDocuments()
    ]);

    // Recent requests
    const recentRequests = await ServiceRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('requestId clientName serviceType status createdAt');

    // Revenue calculation (completed payments)
    const revenueResult = await ServiceRequest.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      success: true,
      data: {
        stats: {
          totalRequests,
          pendingRequests,
          inProgressRequests,
          completedRequests,
          totalContacts,
          newContacts,
          totalRegistrations,
          totalRevenue
        },
        recentRequests
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/requests
// @desc    Get all service requests
// @access  Private/Admin
router.get('/requests', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const requests = await ServiceRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ServiceRequest.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching requests'
    });
  }
});

// @route   GET /api/admin/requests/:id
// @desc    Get single service request
// @access  Private/Admin
router.get('/requests/:id', async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching request'
    });
  }
});

// @route   PUT /api/admin/requests/:id/status
// @desc    Update request status
// @access  Private/Admin
router.put('/requests/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.status = status;
    if (adminNotes) request.adminNotes = adminNotes;
    if (status === 'completed') request.completedAt = new Date();

    await request.save();

    // Send email notification to client
    const statusMessages = {
      'received': 'Your request has been received and is being reviewed.',
      'in-progress': 'Work on your request has begun.',
      'completed': 'Your request has been completed. Results will be sent to you shortly.'
    };

    if (statusMessages[status]) {
      try {
        await sendEmail({
          to: request.clientEmail,
          subject: `Request Update - ${request.requestId}`,
          html: `
            <h2>Request Status Update</h2>
            <p>Dear ${request.clientName},</p>
            <p>${statusMessages[status]}</p>
            <p><strong>Request ID:</strong> ${request.requestId}</p>
            <p><strong>New Status:</strong> ${status.replace('-', ' ').toUpperCase()}</p>
            <br>
            <p>Thank you for choosing ICBB!</p>
          `
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: request
    });

  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status'
    });
  }
});

// @route   POST /api/admin/requests/:id/upload-results
// @desc    Upload completed results
// @access  Private/Admin
router.post('/requests/:id/upload-results', 
  upload.array('files', 10),
  async (req, res) => {
    try {
      const request = await ServiceRequest.findById(req.params.id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found'
        });
      }

      // Process uploaded files
      const completedFiles = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype
      }));

      request.completedFiles.push(...completedFiles);
      request.status = 'completed';
      request.completedAt = new Date();
      await request.save();

      // Send notification with results
      try {
        await sendEmail({
          to: request.clientEmail,
          subject: `Results Ready - ${request.requestId}`,
          html: `
            <h2>Your Results Are Ready!</h2>
            <p>Dear ${request.clientName},</p>
            <p>Great news! The analysis for your request <strong>${request.requestId}</strong> has been completed.</p>
            <p>Your results have been uploaded and are ready for download.</p>
            <p>Please log in to your account or contact us to receive your files.</p>
            <br>
            <p>Thank you for choosing ICBB!</p>
            <p>Best regards,<br>ICBB Data Analysis Team</p>
          `
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      res.json({
        success: true,
        message: 'Results uploaded successfully',
        data: {
          requestId: request.requestId,
          completedFiles: completedFiles.map(f => f.originalName)
        }
      });

    } catch (error) {
      console.error('Upload results error:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading results'
      });
    }
  }
);

// @route   GET /api/admin/contacts
// @desc    Get all contact submissions
// @access  Private/Admin
router.get('/contacts', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const contacts = await ContactSubmission.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ContactSubmission.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    });
  }
});

// @route   PUT /api/admin/contacts/:id/status
// @desc    Update contact status
// @access  Private/Admin
router.put('/contacts/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact'
    });
  }
});

// @route   GET /api/admin/registrations
// @desc    Get all training registrations
// @access  Private/Admin
router.get('/registrations', async (req, res) => {
  try {
    const registrations = await TrainingRegistration.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: registrations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching registrations'
    });
  }
});

// @route   PUT /api/admin/registrations/:id/status
// @desc    Update registration status
// @access  Private/Admin
router.put('/registrations/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const registration = await TrainingRegistration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: registration
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating registration'
    });
  }
});

module.exports = router;
