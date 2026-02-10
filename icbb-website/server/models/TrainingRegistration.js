const mongoose = require('mongoose');

const trainingRegistrationSchema = new mongoose.Schema({
  // Participant Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  institution: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'researcher', 'professional', 'faculty', 'other'],
    default: 'student'
  },

  // Program Details
  programType: {
    type: String,
    required: [true, 'Program type is required'],
    enum: ['workshop', 'short-course', 'bootcamp', 'certification']
  },
  programName: {
    type: String,
    required: true
  },
  programDate: {
    type: Date
  },

  // Additional Info
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  motivation: {
    type: String
  },
  specialRequirements: {
    type: String
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'waitlisted', 'cancelled'],
    default: 'pending'
  },

  // Registration ID
  registrationId: {
    type: String,
    unique: true
  }

}, {
  timestamps: true
});

// Generate registration ID
trainingRegistrationSchema.pre('save', function(next) {
  if (!this.registrationId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.registrationId = `TR-${year}-${random}`;
  }
  next();
});

module.exports = mongoose.model('TrainingRegistration', trainingRegistrationSchema);
