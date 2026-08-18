const mongoose = require('mongoose');

/**
 * One submitted attempt at one unit quiz.
 *
 * Every attempt is stored rather than only the best, so a tutor can see whether
 * a participant improved or simply retried until the score came up.
 *
 * Scores are computed on the server from the stored answer key — never taken
 * from the request body, which the participant controls.
 */
const quizAttemptSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
    index: true
  },
  courseId: { type: String, required: true, index: true },
  unitId: { type: String, required: true },

  // Index of the option chosen for each question, in question order.
  // null means the question was left unanswered.
  responses: [{ type: Number, default: null }],

  correct: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passed: { type: Boolean, required: true },

  durationSeconds: Number
}, { timestamps: true });

quizAttemptSchema.index({ participant: 1, courseId: 1, unitId: 1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
