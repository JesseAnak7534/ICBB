import React, { useEffect, useState, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  FiAward, FiBarChart2, FiCheckCircle, FiClock, FiLogOut, FiPlayCircle
} from 'react-icons/fi';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParticipantAuth } from '../context/ParticipantAuth';
import { getCourseById } from '../data/courses';
import { getModule } from '../content/modules';
import './LearnDashboard.css';

/**
 * The learner's own view of their progress: which units they have attempted,
 * what they scored, and what remains before the certificate.
 */
const LearnDashboard = () => {
  const { participant, isSignedIn, isLoading, signOut, authFetch } = useParticipantAuth();
  const [progressByCourse, setProgressByCourse] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  const loadProgress = useCallback(async () => {
    const courses = (participant && participant.enrolments) || [];

    if (!isSignedIn || courses.length === 0) {
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    try {
      const results = await Promise.all(
        courses.map(async (enrolment) => {
          const response = await authFetch(`/api/participants/progress/${enrolment.courseId}`);
          const data = await response.json();
          return [enrolment.courseId, data.success ? data.progress : null];
        })
      );
      setProgressByCourse(Object.fromEntries(results));
      setError(null);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsFetching(false);
    }
  }, [isSignedIn, participant, authFetch]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  if (isLoading) {
    return <LoadingSpinner message="Loading your account…" />;
  }

  if (!isSignedIn) {
    return <Navigate to="/learn/sign-in" replace state={{ from: '/learn' }} />;
  }

  const enrolments = participant.enrolments || [];

  return (
    <div className="learn-dashboard">
      <SEO title="My learning" description="Your progress through ICBB training courses." />

      <section className="learn-hero">
        <div className="container">
          <div className="learn-hero-row">
            <div>
              <span className="learn-kicker">My learning</span>
              <h1>{participant.fullName}</h1>
              <p className="learn-hero-meta">
                {participant.email}
                {participant.institution ? ` · ${participant.institution}` : ''}
              </p>
            </div>
            <button type="button" className="btn btn-outline learn-signout" onClick={signOut}>
              <FiLogOut /> Sign out
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {error && <div className="learn-error" role="alert">{error}</div>}

          {enrolments.length === 0 ? (
            <div className="learn-empty">
              <h2>You are not enrolled in a course yet</h2>
              <p>
                Enrol from any course page to start recording your progress. All
                the material is readable before you enrol.
              </p>
              <Link className="btn btn-primary" to="/training">Browse courses</Link>
            </div>
          ) : isFetching ? (
            <LoadingSpinner message="Loading your progress…" />
          ) : (
            enrolments.map((enrolment) => {
              const course = getCourseById(enrolment.courseId);
              const module = getModule(enrolment.courseId);
              const progress = progressByCourse[enrolment.courseId];

              if (!course) return null;

              const totalUnits = (module && module.units.length) || (progress && progress.totalUnits) || 0;
              const unitsPassed = (progress && progress.unitsPassed) || 0;
              const percentComplete = totalUnits ? Math.round((unitsPassed / totalUnits) * 100) : 0;
              const scoreByUnit = {};
              if (progress) {
                progress.units.forEach((unit) => { scoreByUnit[unit.unitId] = unit; });
              }

              return (
                <article className="learn-course" key={enrolment.courseId}>
                  <header className="learn-course-head">
                    <div>
                      <h2>{course.title}</h2>
                      <p className="learn-course-meta">
                        Enrolled {new Date(enrolment.enrolledAt).toLocaleDateString()}
                        {module ? ` · ${module.code}` : ''}
                      </p>
                    </div>
                    {module && (
                      <Link className="btn btn-outline" to={`/training/${course.id}/module`}>
                        Open module
                      </Link>
                    )}
                  </header>

                  <div className="learn-stats">
                    <div className="learn-stat">
                      <FiCheckCircle />
                      <strong>{unitsPassed} / {totalUnits}</strong>
                      <span>Units passed</span>
                    </div>
                    <div className="learn-stat">
                      <FiBarChart2 />
                      <strong>{progress ? progress.averageScore : 0}%</strong>
                      <span>Average score</span>
                    </div>
                    <div className="learn-stat">
                      <FiClock />
                      <strong>{progress ? progress.attemptCount : 0}</strong>
                      <span>Attempts made</span>
                    </div>
                    <div className="learn-stat">
                      <FiAward />
                      <strong>{percentComplete}%</strong>
                      <span>Complete</span>
                    </div>
                  </div>

                  <div className="learn-progress-bar" aria-hidden="true">
                    <span style={{ width: `${percentComplete}%` }} />
                  </div>

                  {module && (
                    <ol className="learn-units">
                      {module.units.map((unit) => {
                        const score = scoreByUnit[unit.id];
                        const status = !score ? 'not-started' : score.passed ? 'passed' : 'attempted';

                        return (
                          <li key={unit.id} className={`learn-unit is-${status}`}>
                            <span className="learn-unit-number">{unit.number}</span>
                            <span className="learn-unit-title">{unit.title}</span>
                            <span className="learn-unit-score">
                              {score ? `${score.percentage}%` : '—'}
                            </span>
                            <Link
                              className="learn-unit-action"
                              to={`/training/${course.id}/module/${unit.id}`}
                            >
                              <FiPlayCircle /> {score ? 'Retake' : 'Start'}
                            </Link>
                          </li>
                        );
                      })}
                    </ol>
                  )}

                  {module && (
                    <p className="learn-certificate-note">
                      <FiAward /> {module.certificate}
                    </p>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default LearnDashboard;
