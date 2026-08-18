const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const { protectParticipant } = require('../middleware/auth');
const coursePrices = require('../data/course-prices.json');

/**
 * Course materials — slides, handouts, workbooks.
 *
 * These used to sit in the site's public folder, which meant the CDN served
 * them to anyone with the URL and registration bought nothing. They now live
 * outside the web root and are streamed from here only to a signed-in
 * participant who has paid for that course.
 */

// materials/ sits at the project root, one level above server/.
const MATERIALS_ROOT = path.join(__dirname, '..', '..', 'materials');

/** Course id -> directory name under materials/. */
const FOLDER_BY_COURSE = {
  'research-methods-design': 'research-methods'
};

const COURSE_BY_FOLDER = Object.fromEntries(
  Object.entries(FOLDER_BY_COURSE).map(([courseId, folder]) => [folder, courseId])
);

const CONTENT_TYPES = {
  '.pdf': 'application/pdf',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.html': 'text/html; charset=utf-8',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.zip': 'application/zip'
};

/**
 * Only ever serve a file that resolves inside MATERIALS_ROOT.
 *
 * Express decodes %2e%2e for us, so a traversal attempt arrives here looking
 * like an ordinary name. Resolving and then checking the prefix is what stops
 * `../../server/.env` being served.
 */
const safeResolve = (folder, filename) => {
  const target = path.resolve(MATERIALS_ROOT, folder, filename);
  const root = path.resolve(MATERIALS_ROOT);

  if (target !== root && !target.startsWith(root + path.sep)) {
    return null;
  }
  return target;
};

// @route   GET /api/materials/:folder
// @desc    What this course ships, and whether the caller may download it.
// @access  Private
router.get('/:folder', protectParticipant, (req, res) => {
  const { folder } = req.params;
  const courseId = COURSE_BY_FOLDER[folder];

  if (!courseId) {
    return res.status(404).json({ success: false, message: 'Unknown course' });
  }

  const paid = req.participant.hasPaidFor(courseId);
  const dir = safeResolve(folder, '.');

  let files = [];
  if (dir && fs.existsSync(dir)) {
    files = fs.readdirSync(dir)
      .filter((name) => CONTENT_TYPES[path.extname(name).toLowerCase()])
      .map((name) => ({
        name,
        size: fs.statSync(path.join(dir, name)).size,
        type: path.extname(name).slice(1)
      }));
  }

  res.json({
    success: true,
    courseId,
    paid,
    price: coursePrices.prices[courseId] || null,
    currency: coursePrices.currency,
    files: paid ? files : []
  });
});

// @route   GET /api/materials/:folder/:filename
// @desc    Stream one file to a participant who has paid for the course.
// @access  Private
router.get('/:folder/:filename', protectParticipant, (req, res) => {
  const { folder, filename } = req.params;
  const courseId = COURSE_BY_FOLDER[folder];

  if (!courseId) {
    return res.status(404).json({ success: false, message: 'Unknown course' });
  }

  if (!req.participant.isEnrolledIn(courseId)) {
    return res.status(403).json({
      success: false,
      code: 'NOT_ENROLLED',
      message: 'Enrol in this course to download its materials'
    });
  }

  if (!req.participant.hasPaidFor(courseId)) {
    return res.status(402).json({
      success: false,
      code: 'PAYMENT_REQUIRED',
      message: 'Complete your payment to download the course materials',
      price: coursePrices.prices[courseId] || null,
      currency: coursePrices.currency
    });
  }

  const extension = path.extname(filename).toLowerCase();
  if (!CONTENT_TYPES[extension]) {
    return res.status(400).json({ success: false, message: 'Unsupported file type' });
  }

  const filePath = safeResolve(folder, filename);

  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }

  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.setHeader('Content-Length', fs.statSync(filePath).size);
  res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filename)}"`);
  // Paid material must not be cached by shared proxies.
  res.setHeader('Cache-Control', 'private, max-age=0, no-store');

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Could not read the file' });
    }
  });
  stream.pipe(res);
});

module.exports = router;
