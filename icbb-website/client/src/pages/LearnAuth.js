import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FiArrowRight, FiLock, FiUserPlus } from 'react-icons/fi';
import SEO from '../components/SEO';
import { useParticipantAuth } from '../context/ParticipantAuth';
import { isFree } from '../data/courses';
import './LearnAuth.css';

/**
 * Participant sign-in and registration.
 *
 * One component serves both, switched by the `mode` route param, because the
 * two forms share almost all of their behaviour and the learner frequently
 * needs to move between them.
 */
const LearnAuth = () => {
  const { mode } = useParams();
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, register } = useParticipantAuth();

  // Where to return to after signing in, e.g. the unit the learner was reading.
  const returnTo = (location.state && location.state.from) || '/learn';

  // Registration is not finished until the course fee is paid, so a new
  // account created from a course page goes straight to the payment step.
  const courseId = location.state && location.state.courseId;

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    institution: '',
    role: 'student'
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        await register({ ...form, courseId });
        // A free course is unlocked by registering, so there is no payment step.
        const next = courseId && !isFree(courseId) ? `/learn/pay/${courseId}` : (courseId ? returnTo : '/learn');
        navigate(next, { replace: true });
        return;
      }

      await signIn(form.email, form.password);
      navigate(returnTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="learn-auth-page">
      <SEO
        title={isRegister ? 'Create your learner account' : 'Sign in'}
        description="Sign in to track your progress through ICBB training courses."
      />

      <div className="container">
        <div className="learn-auth-card">
          <div className="learn-auth-icon">
            {isRegister ? <FiUserPlus /> : <FiLock />}
          </div>

          <h1>{isRegister ? 'Create your learner account' : 'Sign in to continue'}</h1>
          <p className="learn-auth-lede">
            {isRegister
              ? 'Registering records your progress against your name and unlocks the course materials to download.'
              : 'Pick up where you left off and keep your results in one place.'}
          </p>

          {error && <div className="learn-auth-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="learn-auth-form">
            {isRegister && (
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full name *</label>
                <input
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  value={form.fullName}
                  onChange={change}
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address *</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={change}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password *</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                value={form.password}
                onChange={change}
                required
                minLength={isRegister ? 8 : undefined}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
              {isRegister && (
                <small className="form-hint">At least 8 characters.</small>
              )}
            </div>

            {isRegister && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="institution">Institution</label>
                    <input
                      id="institution"
                      name="institution"
                      className="form-input"
                      value={form.institution}
                      onChange={change}
                      autoComplete="organization"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      className="form-input"
                      value={form.phone}
                      onChange={change}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="role">I am a</label>
                  <select
                    id="role"
                    name="role"
                    className="form-select"
                    value={form.role}
                    onChange={change}
                  >
                    <option value="student">Student</option>
                    <option value="researcher">Researcher</option>
                    <option value="professional">Professional</option>
                    <option value="faculty">Faculty</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
              {isSubmitting
                ? 'Please wait…'
                : <>{isRegister ? 'Create account' : 'Sign in'} <FiArrowRight /></>}
            </button>
          </form>

          <p className="learn-auth-switch">
            {isRegister ? (
              <>Already have an account? <Link to="/learn/sign-in" state={location.state}>Sign in</Link></>
            ) : (
              <>New here? <Link to="/learn/register" state={location.state}>Create an account</Link></>
            )}
          </p>

          <p className="learn-auth-note">
            An account is only needed to record your results. All course material
            and quizzes remain open to everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnAuth;
