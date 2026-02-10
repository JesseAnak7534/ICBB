const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ContactSubmission = require('../models/ContactSubmission');
const { sendEmail } = require('../utils/email');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, subject, message, category } = req.body;

    // Create contact submission
    const submission = await ContactSubmission.create({
      name,
      email,
      subject,
      message,
      category: category || 'general'
    });

    // Send notification email to admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'jesseanak98@gmail.com',
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Category:</strong> ${category || 'General'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
        `
      });
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    // Send confirmation to sender
    try {
      await sendEmail({
        to: email,
        subject: 'Thank you for contacting ICBB',
        html: `
          <h2>Thank you for reaching out!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <blockquote style="border-left: 3px solid #0066cc; padding-left: 15px; margin-left: 0;">
            ${message.replace(/\n/g, '<br>')}
          </blockquote>
          <p>If you have any urgent inquiries, please feel free to call us at +233 55 975 9592.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>ICBB Team</strong><br>
          Institute of Computational Biology and Bioinformatics</p>
        `
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form'
    });
  }
});

// @route   POST /api/contact/partnership
// @desc    Submit partnership inquiry
// @access  Public
router.post('/partnership', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('organization').trim().notEmpty().withMessage('Organization is required'),
  body('partnershipType').notEmpty().withMessage('Partnership type is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, organization, partnershipType, message } = req.body;

    // Create contact submission with partnership category
    await ContactSubmission.create({
      name,
      email,
      subject: `Partnership Inquiry: ${partnershipType}`,
      message: `Organization: ${organization}\n\nPartnership Type: ${partnershipType}\n\n${message}`,
      category: 'partnership'
    });

    // Send notification
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Partnership Inquiry from ${organization}`,
        html: `
          <h2>Partnership Inquiry</h2>
          <p><strong>Contact:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Organization:</strong> ${organization}</p>
          <p><strong>Partnership Type:</strong> ${partnershipType}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Partnership inquiry submitted successfully!'
    });

  } catch (error) {
    console.error('Partnership submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting partnership inquiry'
    });
  }
});

module.exports = router;
