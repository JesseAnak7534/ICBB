import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import {
  FiSmartphone, FiCheckCircle, FiAlertCircle, FiLoader, FiArrowRight, FiShield
} from 'react-icons/fi';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
import { useParticipantAuth } from '../context/ParticipantAuth';
import { getCourseById } from '../data/courses';
import { getApiUrl } from '../config/api';
import './LearnPayment.css';

/**
 * Course fee, paid by MTN Mobile Money — the last step of registration.
 *
 * Entering a number and pressing Proceed raises a prompt on that handset. The
 * payer approves it with their MoMo PIN; no API can move money without that.
 * This page then polls the API until MTN settles the request, so nobody has to
 * read an SMS receipt or type a transaction ID.
 */

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 150000; // MoMo prompts expire after a couple of minutes

const LearnPayment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, isLoading, authFetch, participant } = useParticipantAuth();
  const course = getCourseById(courseId);

  const [price, setPrice] = useState(null);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | requesting | waiting | paid | failed | error
  const [message, setMessage] = useState(null);
  const [manualDetails, setManualDetails] = useState(null);

  const pollTimer = useRef(null);
  const pollDeadline = useRef(0);

  // Prefill from the account, since most people pay from their own number.
  useEffect(() => {
    if (participant && participant.phone && !phone) setPhone(participant.phone);
  }, [participant, phone]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(getApiUrl(`/api/participants/price/${courseId}`));
        const data = await response.json();
        if (!cancelled && data.success) setPrice(data.price);
      } catch {
        // Leave price null; the form explains it cannot be loaded.
      }
    })();

    return () => { cancelled = true; };
  }, [courseId]);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      window.clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const poll = useCallback(async () => {
    try {
      const response = await authFetch(`/api/participants/payment/${courseId}`);
      const data = await response.json();

      if (!data.success) throw new Error(data.message || 'Could not check the payment');

      const state = data.payment.status;

      if (state === 'paid') {
        setStatus('paid');
        setMessage(null);
        stopPolling();
        return;
      }

      if (state === 'failed') {
        setStatus('failed');
        setMessage(data.payment.failureReason || 'The payment was not approved.');
        stopPolling();
        return;
      }

      if (Date.now() > pollDeadline.current) {
        setStatus('failed');
        setMessage(
          'We did not get a confirmation in time. If you approved the payment it may ' +
          'still arrive — check your progress page in a minute, or try again.'
        );
        stopPolling();
        return;
      }

      pollTimer.current = window.setTimeout(poll, POLL_INTERVAL_MS);
    } catch (error) {
      // A single failed poll should not abandon a payment that may be fine.
      if (Date.now() > pollDeadline.current) {
        setStatus('error');
        setMessage(error.message);
        stopPolling();
      } else {
        pollTimer.current = window.setTimeout(poll, POLL_INTERVAL_MS);
      }
    }
  }, [authFetch, courseId, stopPolling]);

  const submit = async (event) => {
    event.preventDefault();
    setStatus('requesting');
    setMessage(null);
    setManualDetails(null);

    try {
      const response = await authFetch('/api/participants/pay', {
        method: 'POST',
        body: JSON.stringify({ courseId, phone })
      });

      const data = await response.json();

      if (response.status === 503 && data.code === 'MOMO_NOT_CONFIGURED') {
        setStatus('error');
        setMessage(data.message);
        setManualDetails({
          payTo: data.payTo,
          payToName: data.payToName,
          amount: data.amount,
          currency: data.currency
        });
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Could not start the payment');
      }

      if (data.payment && data.payment.status === 'paid') {
        setStatus('paid');
        return;
      }

      setStatus('waiting');
      pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;
      pollTimer.current = window.setTimeout(poll, POLL_INTERVAL_MS);
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading…" />;

  if (!isSignedIn) {
    return <Navigate to="/learn/register" replace state={{ from: `/learn/pay/${courseId}`, courseId }} />;
  }

  if (!course) return <Navigate to="/training" replace />;

  const busy = status === 'requesting' || status === 'waiting';

  return (
    <div className="learn-payment-page">
      <SEO title="Complete your registration" description="Pay your ICBB course fee by mobile money." />

      <div className="container">
        <div className="pay-card">
          <ol className="pay-steps" aria-label="Registration progress">
            <li className="is-done">Account</li>
            <li className={status === 'paid' ? 'is-done' : 'is-current'}>Payment</li>
            <li className={status === 'paid' ? 'is-current' : ''}>Access</li>
          </ol>

          {status === 'paid' ? (
            <div className="pay-result is-good">
              <FiCheckCircle />
              <h1>Payment received</h1>
              <p>
                You are enrolled in <strong>{course.title}</strong>. All the course
                materials — slides, handouts and the workbook — are now available to
                download.
              </p>
              <div className="pay-actions">
                <Link className="btn btn-primary" to={`/training/${courseId}/module`}>
                  Open the course <FiArrowRight />
                </Link>
                <Link className="btn btn-outline" to="/learn">My progress</Link>
              </div>
            </div>
          ) : (
            <>
              <h1>Complete your registration</h1>
              <p className="pay-lede">
                One last step. Pay the course fee with MTN Mobile Money and your
                materials unlock straight away.
              </p>

              <div className="pay-summary">
                <div>
                  <span className="pay-summary-label">Course</span>
                  <strong>{course.title}</strong>
                </div>
                <div className="pay-amount">
                  <span className="pay-summary-label">Fee</span>
                  <strong>
                    {price ? `${price.currency} ${price.amount}` : '—'}
                  </strong>
                </div>
              </div>

              <form onSubmit={submit} className="pay-form">
                <label className="form-label" htmlFor="momo">Your MoMo number</label>
                <div className="pay-input-row">
                  <FiSmartphone />
                  <input
                    id="momo"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0XX XXX XXXX"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    disabled={busy}
                  />
                </div>
                <small className="form-hint">
                  A prompt will be sent to this phone. Approve it with your MoMo PIN.
                </small>

                <button type="submit" className="btn btn-primary btn-lg" disabled={busy || !price}>
                  {status === 'requesting'
                    ? <><FiLoader className="spin" /> Sending prompt…</>
                    : status === 'waiting'
                      ? <><FiLoader className="spin" /> Waiting for approval…</>
                      : <>Proceed <FiArrowRight /></>}
                </button>
              </form>

              {status === 'waiting' && (
                <div className="pay-waiting" role="status">
                  <FiSmartphone />
                  <div>
                    <strong>Check your phone</strong>
                    <p>
                      Approve the payment with your MoMo PIN. This page updates on its
                      own — there is nothing to type here. If no prompt arrives, dial
                      *170# and check your approvals.
                    </p>
                  </div>
                </div>
              )}

              {message && (
                <div className={`pay-message ${status === 'failed' || status === 'error' ? 'is-bad' : ''}`}>
                  <FiAlertCircle />
                  <div>
                    <p>{message}</p>
                    {manualDetails && manualDetails.payTo && (
                      <p className="pay-manual">
                        Meanwhile you can send{' '}
                        <strong>{manualDetails.currency} {manualDetails.amount}</strong> to{' '}
                        <strong>{manualDetails.payTo}</strong>
                        {manualDetails.payToName ? ` (${manualDetails.payToName})` : ''} and
                        contact ICBB with the transaction ID.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {(status === 'failed' || status === 'error') && (
                <button
                  type="button"
                  className="btn btn-outline pay-retry"
                  onClick={() => { setStatus('idle'); setMessage(null); }}
                >
                  Try again
                </button>
              )}

              <p className="pay-note">
                <FiShield /> ICBB never sees or stores your MoMo PIN. The payment is
                approved on your own handset, and confirmed with MTN before anything
                is unlocked.
              </p>

              <button type="button" className="pay-skip" onClick={() => navigate('/learn')}>
                Pay later — take me to my account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnPayment;
