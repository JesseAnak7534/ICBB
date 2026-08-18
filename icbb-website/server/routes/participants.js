const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const Participant = require('../models/Participant');
const QuizAttempt = require('../models/QuizAttempt');
const { protectParticipant } = require('../middleware/auth');
const { jwtSecret, jwtExpire } = require('../config/env');
const quizKeys = require('../data/quiz-keys.json');
const { sendEmail } = require('../utils/email');
const { gradeAttempt } = require('../utils/grading');

/**
 * Participant accounts: registration, sign-in, enrolment and quiz attempts.
 *
 * Quiz submissions are graded here against `data/quiz-keys.json`, which is
 * generated from the course content. The client sends only which option it
 * chose — it never sends a score — because anything the participant's browser
 * reports about their own mark is not evidence.
 */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { success: false, message: 'Too many attempts. Please try again later.' }
});

const issueToken = (participant) =>
  jwt.sign({ id: participant._id, type: 'participant' }, jwtSecret, { expiresIn: jwtExpire });

const firstError = (errors) => errors.array()[0].msg;

/* ----------------------------------------------------------------- signup -- */

// @route   POST /api/participants/register
// @access  Public
router.post('/register', authLimiter, [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('institution').optional().trim(),
  body('phone').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: firstError(errors) });
    }

    const { fullName, email, password, phone, institution, role, courseId } = req.body;

    const existing = await Participant.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with that email already exists. Please sign in instead.'
      });
    }

    const participant = await Participant.create({
      fullName,
      email,
      password,
      phone,
      institution,
      role: role || 'student',
      enrolments: courseId ? [{ courseId }] : []
    });

    try {
      await sendEmail({
        to: participant.email,
        subject: 'Welcome to ICBB Training',
        html: `
          <h2>Welcome, ${participant.fullName}</h2>
          <p>Your ICBB training account is ready. You can now work through the
          course units and your quiz results will be recorded against your name.</p>
          <p>Sign in any time at <a href="https://icbb-gh.com/learn">icbb-gh.com/learn</a>.</p>
          <p>ICBB Training Team</p>
        `
      });
    } catch (emailError) {
      console.error('Welcome email failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      token: issueToken(participant),
      participant: participant.toProfile()
    });
  } catch (error) {
    console.error('Participant registration error:', error);
    res.status(500).json({ success: false, message: 'Could not create your account' });
  }
});

/* ------------------------------------------------------------------ login -- */

// @route   POST /api/participants/login
// @access  Public
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: firstError(errors) });
    }

    const { email, password } = req.body;
    const participant = await Participant.findOne({ email }).select('+password');

    // The same message for unknown email and wrong password, so the endpoint
    // cannot be used to discover which addresses have accounts.
    if (!participant || !(await participant.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!participant.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated' });
    }

    participant.lastLogin = new Date();
    await participant.save();

    res.json({
      success: true,
      token: issueToken(participant),
      participant: participant.toProfile()
    });
  } catch (error) {
    console.error('Participant login error:', error);
    res.status(500).json({ success: false, message: 'Could not sign you in' });
  }
});

/* ---------------------------------------------------------------- profile -- */

// @route   GET /api/participants/me
// @access  Private
router.get('/me', protectParticipant, (req, res) => {
  res.json({ success: true, participant: req.participant.toProfile() });
});

// @route   POST /api/participants/enrol
// @access  Private
router.post('/enrol', protectParticipant, [
  body('courseId').trim().notEmpty().withMessage('Course is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: firstError(errors) });
    }

    const { courseId } = req.body;
    const participant = req.participant;

    if (participant.isEnrolledIn(courseId)) {
      return res.json({
        success: true,
        message: 'Already enrolled',
        participant: participant.toProfile()
      });
    }

    participant.enrolments.push({ courseId });
    await participant.save();

    res.status(201).json({
      success: true,
      message: 'Enrolled',
      participant: participant.toProfile()
    });
  } catch (error) {
    console.error('Enrolment error:', error);
    res.status(500).json({ success: false, message: 'Could not complete enrolment' });
  }
});

/* ------------------------------------------------------------ quiz attempts -- */

// @route   POST /api/participants/quiz-attempts
// @desc    Submit a unit quiz. Graded here, not in the browser.
// @access  Private
router.post('/quiz-attempts', protectParticipant, [
  body('courseId').trim().notEmpty().withMessage('Course is required'),
  body('unitId').trim().notEmpty().withMessage('Unit is required'),
  body('responses').isArray().withMessage('Responses must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: firstError(errors) });
    }

    const { courseId, unitId, responses, durationSeconds } = req.body;

    const courseKey = quizKeys.courses[courseId];
    const unitKey = courseKey && courseKey.units[unitId];

    if (!unitKey) {
      return res.status(404).json({ success: false, message: 'Unknown course or unit' });
    }

    const answers = unitKey.answers;

    let graded;
    try {
      graded = gradeAttempt(answers, responses, courseKey.passMark || 60);
    } catch (gradingError) {
      return res.status(400).json({ success: false, message: gradingError.message });
    }

    const attempt = await QuizAttempt.create({
      participant: req.participant._id,
      courseId,
      unitId,
      responses: graded.responses,
      correct: graded.correct,
      total: graded.total,
      percentage: graded.percentage,
      passed: graded.passed,
      durationSeconds
    });

    // Return the marking so the browser can show feedback it did not compute.
    res.status(201).json({
      success: true,
      result: {
        attemptId: attempt._id,
        correct: graded.correct,
        total: graded.total,
        percentage: graded.percentage,
        passed: graded.passed,
        answers,
        marks: graded.marks
      }
    });
  } catch (error) {
    console.error('Quiz attempt error:', error);
    res.status(500).json({ success: false, message: 'Could not record your attempt' });
  }
});

// @route   GET /api/participants/progress/:courseId
// @access  Private
router.get('/progress/:courseId', protectParticipant, async (req, res) => {
  try {
    const { courseId } = req.params;

    const attempts = await QuizAttempt.find({
      participant: req.participant._id,
      courseId
    }).sort({ createdAt: 1 });

    // Best attempt per unit is what counts towards progress.
    const bestByUnit = {};
    attempts.forEach((attempt) => {
      const current = bestByUnit[attempt.unitId];
      if (!current || attempt.percentage > current.percentage) {
        bestByUnit[attempt.unitId] = {
          unitId: attempt.unitId,
          correct: attempt.correct,
          total: attempt.total,
          percentage: attempt.percentage,
          passed: attempt.passed,
          attemptedAt: attempt.createdAt
        };
      }
    });

    const best = Object.values(bestByUnit);
    const unitsPassed = best.filter((unit) => unit.passed).length;
    const totalUnits = quizKeys.courses[courseId]
      ? Object.keys(quizKeys.courses[courseId].units).length
      : 0;

    const averageScore = best.length
      ? Math.round(best.reduce((sum, unit) => sum + unit.percentage, 0) / best.length)
      : 0;

    res.json({
      success: true,
      progress: {
        courseId,
        totalUnits,
        unitsAttempted: best.length,
        unitsPassed,
        averageScore,
        attemptCount: attempts.length,
        units: best
      }
    });
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ success: false, message: 'Could not load your progress' });
  }
});

module.exports = router;
