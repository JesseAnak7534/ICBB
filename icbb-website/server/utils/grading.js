/**
 * Quiz grading.
 *
 * Kept as a pure function, separate from the route, so the marking rules can be
 * tested directly without a database and so there is exactly one place where a
 * score is decided.
 */

/**
 * @param {number[]} answers   correct option index per question
 * @param {any[]}    responses what the participant submitted
 * @param {number}   passMark  percentage needed to pass
 */
const gradeAttempt = (answers, responses, passMark = 60) => {
  if (!Array.isArray(answers) || answers.length === 0) {
    throw new Error('An answer key is required to grade an attempt');
  }

  if (!Array.isArray(responses) || responses.length !== answers.length) {
    throw new Error(
      `Expected ${answers.length} responses, received ${
        Array.isArray(responses) ? responses.length : 'none'
      }`
    );
  }

  // Anything that is not a whole number counts as unanswered. This also stops a
  // crafted payload (a string, an object, NaN) from matching by coercion.
  const normalised = responses.map((value) =>
    Number.isInteger(value) ? value : null
  );

  const marks = answers.map((answer, i) => normalised[i] === answer);
  const correct = marks.filter(Boolean).length;
  const total = answers.length;
  const percentage = Math.round((correct / total) * 100);

  return {
    responses: normalised,
    marks,
    correct,
    total,
    percentage,
    passed: percentage >= passMark
  };
};

module.exports = { gradeAttempt };
