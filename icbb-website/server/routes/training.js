const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const TrainingRegistration = require('../models/TrainingRegistration');
const { sendEmail } = require('../utils/email');

// Normalise a display type ("Short Course") to the stored form ("short-course").
// The website sends the normalised value, but accepting either shape here means
// a future copy-paste of a display label cannot break registrations again.
const normaliseProgramType = (value) =>
  String(value || '').trim().toLowerCase().replace(/\s+/g, '-');

const PROGRAM_TYPES = ['workshop', 'short-course', 'bootcamp', 'certification'];

// Available training programs
const trainingPrograms = [
  {
    id: 'research-methods-design',
    name: 'Research Methods: Quantitative & Qualitative Design',
    type: 'short-course',
    duration: '1 week',
    level: 'beginner',
    series: { slug: 'research-methods', part: 1, totalParts: 3 },
    description: 'Design a study that can actually answer your research question — across both quantitative and qualitative traditions.'
  },
  {
    id: 'quantitative-data-analysis',
    name: 'Quantitative Data Analysis',
    type: 'short-course',
    duration: '2 weeks',
    level: 'intermediate',
    series: { slug: 'research-methods', part: 2, totalParts: 3 },
    description: 'Clean, analyse and report numerical data — from descriptive statistics through regression modelling — with reproducible output.'
  },
  {
    id: 'qualitative-data-analysis',
    name: 'Qualitative Data Analysis',
    type: 'short-course',
    duration: '2 weeks',
    level: 'intermediate',
    series: { slug: 'research-methods', part: 3, totalParts: 3 },
    description: 'Turn interviews, focus groups and field notes into themes you can defend, with a transparent audit trail from quote to conclusion.'
  },
  {
    id: 'intro-bioinformatics',
    name: 'Introduction to Bioinformatics',
    type: 'workshop',
    duration: '3 days',
    level: 'beginner',
    description: 'Learn the fundamentals of bioinformatics, including sequence analysis and database usage.'
  },
  {
    id: 'data-analysis-r',
    name: 'Data Analysis with R',
    type: 'short-course',
    duration: '2 weeks',
    level: 'intermediate',
    description: 'Master statistical analysis and visualization using R programming language.'
  },
  {
    id: 'genomics-bootcamp',
    name: 'Genomics Analysis Bootcamp',
    type: 'bootcamp',
    duration: '4 weeks',
    level: 'intermediate',
    description: 'Intensive training in genomic data analysis, from raw sequencing data to biological insights.'
  },
  {
    id: 'ml-biology',
    name: 'Machine Learning in Biology',
    type: 'short-course',
    duration: '3 weeks',
    level: 'advanced',
    description: 'Apply machine learning algorithms to biological and biomedical problems.'
  },
  {
    id: 'python-biologists',
    name: 'Python for Biologists',
    type: 'workshop',
    duration: '5 days',
    level: 'beginner',
    description: 'Learn Python programming for biological data analysis and automation.'
  },
  {
    id: 'statistical-methods',
    name: 'Statistical Methods for Research',
    type: 'short-course',
    duration: '2 weeks',
    level: 'intermediate',
    description: 'Comprehensive training in statistical methods commonly used in biological research.'
  }
];

// @route   GET /api/training/programs
// @desc    Get available training programs
// @access  Public
router.get('/programs', (req, res) => {
  res.json({
    success: true,
    programs: trainingPrograms
  });
});

// @route   GET /api/training/programs/:id
// @desc    Get specific program details
// @access  Public
router.get('/programs/:id', (req, res) => {
  const program = trainingPrograms.find(p => p.id === req.params.id);
  
  if (!program) {
    return res.status(404).json({
      success: false,
      message: 'Program not found'
    });
  }

  res.json({
    success: true,
    program
  });
});

// @route   POST /api/training/register
// @desc    Register for a training program
// @access  Public
router.post('/register', [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('programName').notEmpty().withMessage('Program is required'),
  body('programType')
    .customSanitizer(normaliseProgramType)
    .isIn(PROGRAM_TYPES)
    .withMessage(`Program type must be one of: ${PROGRAM_TYPES.join(', ')}`)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      fullName,
      email,
      phone,
      institution,
      role,
      programType,
      programName,
      programDate,
      experienceLevel,
      motivation,
      specialRequirements
    } = req.body;

    // Create registration
    const registration = await TrainingRegistration.create({
      fullName,
      email,
      phone,
      institution,
      role: role || 'student',
      programType,
      programName,
      programDate: programDate ? new Date(programDate) : null,
      experienceLevel: experienceLevel || 'beginner',
      motivation,
      specialRequirements
    });

    // Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: `Registration Confirmed - ${programName}`,
        html: `
          <h2>Training Registration Confirmation</h2>
          <p>Dear ${fullName},</p>
          <p>Thank you for registering for <strong>${programName}</strong>!</p>
          <p><strong>Registration ID:</strong> ${registration.registrationId}</p>
          <p><strong>Program Type:</strong> ${programType}</p>
          <p>We will send you more details about the program schedule and requirements soon.</p>
          <br>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>ICBB Training Team</strong></p>
        `
      });

      // Notify admin
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Training Registration - ${programName}`,
        html: `
          <h2>New Training Registration</h2>
          <p><strong>Registration ID:</strong> ${registration.registrationId}</p>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Institution:</strong> ${institution || 'Not provided'}</p>
          <p><strong>Program:</strong> ${programName}</p>
          <p><strong>Experience Level:</strong> ${experienceLevel || 'Beginner'}</p>
          <p><strong>Motivation:</strong> ${motivation || 'Not provided'}</p>
        `
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        registrationId: registration.registrationId,
        programName,
        status: registration.status
      }
    });

  } catch (error) {
    console.error('Training registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing registration'
    });
  }
});

// @route   GET /api/training/registration/:id
// @desc    Get registration status
// @access  Public
router.get('/registration/:id', async (req, res) => {
  try {
    const registration = await TrainingRegistration.findOne({
      registrationId: req.params.id
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: {
        registrationId: registration.registrationId,
        programName: registration.programName,
        status: registration.status,
        createdAt: registration.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching registration'
    });
  }
});

module.exports = router;
