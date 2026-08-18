import React, { useState, useCallback } from 'react';
import { FiCheck, FiX, FiRefreshCw, FiAward } from 'react-icons/fi';
import './Quiz.css';

/**
 * Self-check quiz with immediate per-question feedback.
 *
 * Answers are checked in the browser and the score is kept in localStorage, so
 * the quiz works with no backend and no login. `onComplete` is called with the
 * result when the quiz is submitted, which is the hook for recording scores
 * against a participant account once accounts exist.
 */

const storageKey = (quizId) => `icbb-quiz-${quizId}`;

const readSavedResult = (quizId) => {
  try {
    const raw = window.localStorage.getItem(storageKey(quizId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Private browsing and blocked storage should not break the quiz.
    return null;
  }
};

const Quiz = ({ quizId, title = 'Check your understanding', questions, passMark = 60, onComplete }) => {
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [best, setBest] = useState(() => readSavedResult(quizId));

  const total = questions.length;
  const answeredCount = Object.keys(selected).length;
  const allAnswered = answeredCount === total;

  const correctCount = questions.reduce(
    (count, question, index) => count + (selected[index] === question.answer ? 1 : 0),
    0
  );
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = percentage >= passMark;

  const choose = (questionIndex, optionIndex) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const submit = useCallback(() => {
    if (!allAnswered) return;
    setSubmitted(true);

    const result = { quizId, correct: correctCount, total, percentage, at: new Date().toISOString() };

    // Keep the best attempt rather than the most recent one.
    setBest((previous) => {
      const next = !previous || percentage > previous.percentage ? result : previous;
      try {
        window.localStorage.setItem(storageKey(quizId), JSON.stringify(next));
      } catch {
        // Storage unavailable — the score simply is not remembered.
      }
      return next;
    });

    if (onComplete) onComplete(result);
  }, [allAnswered, correctCount, onComplete, percentage, quizId, total]);

  const retry = () => {
    setSelected({});
    setSubmitted(false);
  };

  return (
    <section className="quiz" aria-labelledby={`quiz-heading-${quizId}`}>
      <header className="quiz-header">
        <div>
          <h2 id={`quiz-heading-${quizId}`}>{title}</h2>
          <p className="quiz-meta">
            {total} questions · pass mark {passMark}%
            {best && ` · best score ${best.percentage}%`}
          </p>
        </div>
        {submitted && (
          <div className={`quiz-score ${passed ? 'is-pass' : 'is-fail'}`}>
            <span className="quiz-score-value">{percentage}%</span>
            <span className="quiz-score-label">{correctCount} of {total}</span>
          </div>
        )}
      </header>

      <ol className="quiz-questions">
        {questions.map((question, questionIndex) => {
          const chosen = selected[questionIndex];
          const isCorrect = chosen === question.answer;

          return (
            <li className="quiz-question" key={questionIndex}>
              <p className="quiz-question-text">{question.question}</p>

              <div className="quiz-options" role="radiogroup" aria-label={question.question}>
                {question.options.map((option, optionIndex) => {
                  const isChosen = chosen === optionIndex;
                  const isAnswer = question.answer === optionIndex;

                  let state = '';
                  if (submitted) {
                    if (isAnswer) state = 'is-correct';
                    else if (isChosen) state = 'is-wrong';
                  } else if (isChosen) {
                    state = 'is-chosen';
                  }

                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={isChosen}
                      key={optionIndex}
                      className={`quiz-option ${state}`}
                      onClick={() => choose(questionIndex, optionIndex)}
                      disabled={submitted}
                    >
                      <span className="quiz-option-marker">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="quiz-option-text">{option}</span>
                      {submitted && isAnswer && <FiCheck className="quiz-option-icon" />}
                      {submitted && isChosen && !isAnswer && <FiX className="quiz-option-icon" />}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className={`quiz-explanation ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
                  <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong>{' '}
                  {question.explanation}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <footer className="quiz-footer">
        {!submitted ? (
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={submit}
              disabled={!allAnswered}
            >
              Submit answers
            </button>
            <span className="quiz-progress">
              {answeredCount} of {total} answered
            </span>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-outline" onClick={retry}>
              <FiRefreshCw /> Try again
            </button>
            <span className={`quiz-verdict ${passed ? 'is-pass' : 'is-fail'}`}>
              {passed ? (
                <><FiAward /> Passed — you scored {percentage}%</>
              ) : (
                <>Below the {passMark}% pass mark. Review the explanations and try again.</>
              )}
            </span>
          </>
        )}
      </footer>
    </section>
  );
};

export default Quiz;
