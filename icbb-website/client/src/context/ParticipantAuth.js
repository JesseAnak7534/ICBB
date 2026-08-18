import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../config/api';

/**
 * Signed-in participant state.
 *
 * The token is kept in localStorage so a refresh does not sign the learner out.
 * On mount the token is verified against /me rather than trusted, so an expired
 * or revoked token clears itself instead of leaving a stale signed-in shell.
 */

const TOKEN_KEY = 'icbb-participant-token';

const ParticipantAuthContext = createContext(null);

const readToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const writeToken = (token) => {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage blocked — the session simply will not survive a refresh.
  }
};

export const ParticipantAuthProvider = ({ children }) => {
  const [token, setToken] = useState(readToken);
  const [participant, setParticipant] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(readToken()));

  const signOut = useCallback(() => {
    writeToken(null);
    setToken(null);
    setParticipant(null);
  }, []);

  // Verify a stored token on first load.
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(getApiUrl('/api/participants/me'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();

        if (cancelled) return;

        if (response.ok && data.success) {
          setParticipant(data.participant);
        } else {
          writeToken(null);
          setToken(null);
          setParticipant(null);
        }
      } catch {
        // Network or API down: keep the token but stay signed out for now, so
        // a temporary outage does not force the learner to sign in again.
        if (!cancelled) setParticipant(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const authenticate = useCallback(async (path, payload) => {
    const response = await fetch(getApiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Something went wrong. Please try again.');
    }

    writeToken(data.token);
    setToken(data.token);
    setParticipant(data.participant);
    return data.participant;
  }, []);

  const signIn = useCallback(
    (email, password) => authenticate('/api/participants/login', { email, password }),
    [authenticate]
  );

  const register = useCallback(
    (details) => authenticate('/api/participants/register', details),
    [authenticate]
  );

  /** Authenticated fetch that signs the participant out on a 401. */
  const authFetch = useCallback(
    async (path, options = {}) => {
      const response = await fetch(getApiUrl(path), {
        ...options,
        headers: {
          ...(options.headers || {}),
          ...(options.body ? { 'Content-Type': 'application/json' } : {}),
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        signOut();
        throw new Error('Your session has expired. Please sign in again.');
      }

      return response;
    },
    [token, signOut]
  );

  const enrol = useCallback(
    async (courseId) => {
      const response = await authFetch('/api/participants/enrol', {
        method: 'POST',
        body: JSON.stringify({ courseId })
      });
      const data = await response.json();
      if (data.success && data.participant) setParticipant(data.participant);
      return data;
    },
    [authFetch]
  );

  const isEnrolled = useCallback(
    (courseId) =>
      Boolean(
        participant &&
          participant.enrolments &&
          participant.enrolments.some(
            (enrolment) => enrolment.courseId === courseId && enrolment.status !== 'withdrawn'
          )
      ),
    [participant]
  );

  const value = {
    participant,
    isSignedIn: Boolean(participant),
    isLoading,
    signIn,
    register,
    signOut,
    authFetch,
    enrol,
    isEnrolled
  };

  return (
    <ParticipantAuthContext.Provider value={value}>
      {children}
    </ParticipantAuthContext.Provider>
  );
};

export const useParticipantAuth = () => {
  const context = useContext(ParticipantAuthContext);
  if (!context) {
    throw new Error('useParticipantAuth must be used inside a ParticipantAuthProvider');
  }
  return context;
};

export default ParticipantAuthContext;
