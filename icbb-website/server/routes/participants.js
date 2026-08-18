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
const coursePrices = require('../data/course-prices.json');
const momo = require('../utils/momo');
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

/* ---------------------------------------------------------------- payment -- */

const priceFor = (courseId) =>
  Object.prototype.hasOwnProperty.call(coursePrices.prices, courseId)
    ? coursePrices.prices[courseId]
    : null;

/** Shape returned to the client for an enrolment's payment. */
const paymentView = (enrolment) => {
  const payment = (enrolment && enrolment.payment) || {};
  return {
    status: payment.status || 'unpaid',
    amount: payment.amount,
    currency: payment.currency,
    momoNumber: payment.momoNumber,
    paidAt: payment.paidAt,
    failureReason: payment.failureReason
  };
};

// @route   GET /api/participants/price/:courseId
// @desc    What this course costs, and whether MoMo can be used right now.
// @access  Public
router.get('/price/:courseId', (req, res) => {
  const amount = priceFor(req.params.courseId);

  if (amount === null) {
    return res.status(404).json({ success: false, message: 'Unknown course' });
  }

  res.json({
    success: true,
    price: {
      courseId: req.params.courseId,
      amount,
      free: amount === 0,
      currency: coursePrices.currency,
      momoAvailable: momo.isConfigured(),
      payTo: process.env.MOMO_ACCOUNT_NUMBER || null,
      payToName: process.env.MOMO_ACCOUNT_NAME || null
    }
  });
});

// @route   POST /api/participants/pay
// @desc    Ask MTN to prompt this participant's phone to approve the course fee.
// @access  Private
router.post('/pay', protectParticipant, [
  body('courseId').trim().notEmpty().withMessage('Course is required'),
  body('phone').trim().notEmpty().withMessage('Your MoMo number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: firstError(errors) });
    }

    const { courseId, phone } = req.body;
    const participant = req.participant;

    // The amount comes from the server's price list. A browser that can name
    // its own price can name zero.
    const amount = priceFor(courseId);
    if (amount === null) {
      return res.status(404).json({ success: false, message: 'Unknown course' });
    }

    // Never raise a payment prompt for a course that costs nothing.
    if (amount === 0) {
      return res.status(400).json({
        success: false,
        code: 'COURSE_IS_FREE',
        message: 'This course is free. Registering is all that is needed.'
      });
    }

    if (!momo.isValidGhanaNumber(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a Ghanaian mobile number, for example 0559759592'
      });
    }

    let enrolment = participant.getEnrolment(courseId);
    if (!enrolment) {
      participant.enrolments.push({ courseId });
      await participant.save();
      enrolment = participant.getEnrolment(courseId);
    }

    if (enrolment.payment && enrolment.payment.status === 'paid') {
      return res.json({
        success: true,
        message: 'This course is already paid for',
        payment: paymentView(enrolment)
      });
    }

    if (!momo.isConfigured()) {
      // Without API credentials no prompt can be raised. Say so plainly rather
      // than leaving the participant watching a spinner that never settles.
      return res.status(503).json({
        success: false,
        code: 'MOMO_NOT_CONFIGURED',
        message:
          'Automatic mobile money is not switched on yet. Please contact ICBB to arrange payment.',
        payTo: process.env.MOMO_ACCOUNT_NUMBER || null,
        payToName: process.env.MOMO_ACCOUNT_NAME || null,
        amount,
        currency: coursePrices.currency
      });
    }

    const request = await momo.requestToPay({
      amount,
      currency: coursePrices.currency,
      phone,
      externalId: participant._id + '-' + courseId + '-' + Date.now(),
      payerMessage: 'ICBB course fee',
      payeeNote: courseId + ' - ' + participant.email
    });

    enrolment.payment = {
      ...(enrolment.payment ? enrolment.payment.toObject() : {}),
      status: 'pending',
      amount,
      currency: request.currency,
      method: 'momo',
      momoNumber: phone,
      referenceId: request.referenceId,
      requestedAt: new Date(),
      failureReason: undefined
    };
    await participant.save();

    res.status(202).json({
      success: true,
      message: 'Check your phone and approve the payment with your MoMo PIN.',
      payment: paymentView(enrolment),
      referenceId: request.referenceId
    });
  } catch (error) {
    if (error instanceof momo.MomoError) {
      console.error('MoMo request error:', error.message, error.body || '');
      return res.status(502).json({
        success: false,
        message: 'Mobile money is not responding right now. Please try again shortly.'
      });
    }
    console.error('Payment error:', error);
    res.status(500).json({ success: false, message: 'Could not start the payment' });
  }
});

// @route   GET /api/participants/payment/:courseId
// @desc    Poll MTN for the outcome, and settle the enrolment on SUCCESSFUL.
// @access  Private
router.get('/payment/:courseId', protectParticipant, async (req, res) => {
  try {
    const { courseId } = req.params;
    const participant = req.participant;
    const enrolment = participant.getEnrolment(courseId);

    if (!enrolment) {
      return res.status(404).json({ success: false, message: 'You are not enrolled in this course' });
    }

    const payment = enrolment.payment;

    // Nothing to poll: either never started, or already settled.
    if (!payment || !payment.referenceId || payment.status === 'paid' || payment.status === 'failed') {
      return res.json({ success: true, payment: paymentView(enrolment) });
    }

    const result = await momo.getPaymentStatus(payment.referenceId);

    if (result.status === 'SUCCESSFUL') {
      payment.status = 'paid';
      payment.paidAt = new Date();
      payment.financialTransactionId = result.financialTransactionId;
      await participant.save();

      try {
        await sendEmail({
          to: participant.email,
          subject: 'ICBB - payment received',
          html:
            '<h2>Payment received</h2>' +
            '<p>Dear ' + participant.fullName + ',</p>' +
            '<p>We have received your payment of ' + payment.currency + ' ' + payment.amount +
            ' for your ICBB course. Your course materials are now available to download ' +
            'when you sign in.</p>' +
            '<p>ICBB Training Team</p>'
        });
      } catch (emailError) {
        console.error('Payment receipt email failed:', emailError.message);
      }
    } else if (result.status === 'FAILED') {
      payment.status = 'failed';
      payment.failureReason = result.reason || 'The payment was not approved';
      await participant.save();
    }

    res.json({ success: true, payment: paymentView(enrolment) });
  } catch (error) {
    if (error instanceof momo.MomoError) {
      console.error('MoMo status error:', error.message);
      return res.status(502).json({
        success: false,
        message: 'Could not reach mobile money to confirm. Please try again shortly.'
      });
    }
    console.error('Payment status error:', error);
    res.status(500).json({ success: false, message: 'Could not check the payment' });
  }
});

module.exports = router;
