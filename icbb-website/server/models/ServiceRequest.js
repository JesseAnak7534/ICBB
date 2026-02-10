const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  // Client Information
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  clientEmail: {
    type: String,
    required: [true, 'Client email is required'],
    lowercase: true,
    trim: true
  },
  institution: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },

  // Service Details
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: [
      'data-cleaning',
      'data-analysis',
      'data-cleaning-analysis',
      'statistical-consulting',
      'bioinformatics-analysis',
      'paper-review'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  deadline: {
    type: Date
  },
  additionalNotes: {
    type: String
  },

  // Files
  uploadedFiles: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Completed Files (from admin)
  completedFiles: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Payment Information
  payment: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    amount: Number,
    currency: {
      type: String,
      default: 'GHS'
    },
    method: {
      type: String,
      default: 'momo'
    },
    momoNumber: String,
    transactionId: String,
    paidAt: Date
  },

  // Request Status
  status: {
    type: String,
    enum: ['pending-payment', 'received', 'in-progress', 'completed', 'cancelled'],
    default: 'pending-payment'
  },

  // Tracking
  requestId: {
    type: String,
    unique: true
  },

  // Admin Notes
  adminNotes: {
    type: String
  },

  // Timestamps
  completedAt: Date

}, {
  timestamps: true
});

// Generate unique request ID before saving
serviceRequestSchema.pre('save', function(next) {
  if (!this.requestId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.requestId = `ICBB-${year}${month}-${random}`;
  }
  next();
});

// Index for searching
serviceRequestSchema.index({ clientEmail: 1, status: 1 });
serviceRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
