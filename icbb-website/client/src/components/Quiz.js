import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiX, FiRefreshCw, FiAward, FiSave, FiUser } from 'react-icons/fi';
import { useParticipantAuth } from '../context/ParticipantAuth';
import './Quiz.css';

/**
 * Unit quiz with immediate per-question feedback.
 *
 * Two modes:
 *  - Signed out: graded in the browser and kept in localStorage, so anyone can
 *    use the material without an account.
 *  - Signed in: the responses are posted to the API, which grades them against
 *    its own answer key and records the attempt. The server's marking is what
 *    is displayed and what counts, because a score reported by the learner's
 *    own browser is not evidence.
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

const Quiz = ({
  quizId,
  title = 'Check your understanding',
  questions,
  passMark = 60,
  courseId,
  unitId,
  onComplete
}) => {
  const { isSignedIn, participant, authFetch } = useParticipantAuth();
  const canRecord = Boolean(isSignedIn && courseId && unitId);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [best, setBest] = useState(() => readSavedResult(quizId));
  const [isSaving, setIsSaving] = useState(false);
  const [saveState, setSaveState] = useState(null);
  const [startedAt] = useState(() => Date.now());

  // When signed in the server returns the marking; otherwise it is computed here.
  const [serverMarks, setServerMarks] = useState(null);

  const total = questions.length;
  const answeredCount = Object.keys(selected).length;
  const allAnswered = answeredCount === total;

  const correctCount = questions.reduce(
    (count, question, index) => count + (selected[index] === question.answer ? 1 : 0),
    0
  );
  // When the API graded the attempt its marking wins, so what the learner sees
  // is what was actually recorded.
  const shownCorrect = serverMarks ? serverMarks.filter(Boolean).length : correctCount;
  const shownPercentage = total > 0 ? Math.round((shownCorrect / total) * 100) : 0;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = shownPercentage >= passMark;

  const choose = (questionIndex, optionIndex) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const rememberLocally = useCallback(
    (result) => {
      setBest((previous) => {
        const next = !previous || result.percentage > previous.percentage ? result : previous;
        try {
          window.localStorage.setItem(storageKey(quizId), JSON.stringify(next));
        } catch {
          // Storage unavailable — the score simply is not remembered.
        }
        return next;
      });
    },
    [quizId]
  );

  const submit = useCallback(async () => {
    if (!allAnswered || isSaving) return;

    // Responses in question order, which is what the API grades.
    const responses = questions.map((_, index) =>
      selected[index] === undefined ? null : selected[index]
    );

    if (canRecord) {
      setIsSaving(true);
      try {
        const response = await authFetch('/api/participants/quiz-attempts', {
          method: 'POST',
          body: JSON.stringify({
            courseId,
            unitId,
            responses,
            durationSeconds: Math.round((Date.now() - startedAt) / 1000)
          })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Could not save your attempt');
        }

        const result = {
          quizId,
          correct: data.result.correct,
          total: data.result.total,
          percentage: data.result.percentage,
          at: new Date().toISOString()
        };

        setServerMarks(data.result.marks);
        rememberLocally(result);
        setSaveState({ ok: true, message: 'Recorded against your account' });
        setSubmitted(true);
        if (onComplete) onComplete(result);
      } catch (error) {
        // Fall back to local marking so a network problem does not lose the work.
        setSaveState({ ok: false, message: error.message });
        setSubmitted(true);
        rememberLocally({ quizId, correct: correctCount, total, percentage, at: new Date().toISOString() });
      } finally {
        setIsSaving(false);
      }
      return;
    }

    const result = { quizId, correct: correctCount, total, percentage, at: new Date().toISOString() };
    rememberLocally(result);
    setSubmitted(true);
    if (onComplete) onComplete(result);
  }, [
    allAnswered, authFetch, canRecord, correctCount, courseId, isSaving, onComplete,
    percentage, questions, quizId, rememberLocally, selected, startedAt, total, unitId
  ]);

  const retry = () => {
    setSelected({});
    setSubmitted(false);
    setServerMarks(null);
    setSaveState(null);
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
          {canRecord ? (
            <p className="quiz-account is-signed-in">
              <FiUser /> Recording against {participant.fullName}
            </p>
          ) : (
            <p className="quiz-account">
              <Link to="/learn/sign-in">Sign in</Link> to have your results recorded
              towards the certificate. You can still take the quiz without an account.
            </p>
          )}
        </div>
        {submitted && (
          <div className={`quiz-score ${passed ? 'is-pass' : 'is-fail'}`}>
            <span className="quiz-score-value">{shownPercentage}%</span>
            <span className="quiz-score-label">{shownCorrect} of {total}</span>
          </div>
        )}
      </header>

      <ol className="quiz-questions">
        {questions.map((question, questionIndex) => {
          const chosen = selected[questionIndex];
          const isCorrect = serverMarks
            ? serverMarks[questionIndex]
            : chosen === question.answer;

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
              disabled={!allAnswered || isSaving}
            >
              {isSaving ? 'Saving…' : 'Submit answers'}
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
                <><FiAward /> Passed — you scored {shownPercentage}%</>
              ) : (
                <>Below the {passMark}% pass mark. Review the explanations and try again.</>
              )}
            </span>
            {saveState && (
              <span className={`quiz-save ${saveState.ok ? 'is-ok' : 'is-error'}`}>
                <FiSave /> {saveState.message}
              </span>
            )}
          </>
        )}
      </footer>
    </section>
  );
};

export default Quiz;
