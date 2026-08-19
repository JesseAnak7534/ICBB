import { useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

/**
 * Asks the API whether it can actually accept a submission.
 *
 * /api/health answers without touching the database, so it can distinguish
 * "the API is down" from "the API is up but has no database". Forms use this to
 * say so plainly instead of letting someone fill in a form that will fail.
 *
 * This is self-clearing: as soon as MONGODB_URI is set, health reports
 * `database: "configured"` and every notice driven by it disappears. There is
 * nothing to remove later.
 *
 * @returns {{ checking: boolean, reachable: boolean, databaseReady: boolean }}
 */
const useApiStatus = () => {
  const [status, setStatus] = useState({
    checking: true,
    reachable: false,
    databaseReady: false
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(getApiUrl('/api/health'));
        const data = await response.json();

        if (cancelled) return;

        setStatus({
          checking: false,
          reachable: response.ok && data.status === 'ok',
          databaseReady: data.database === 'configured'
        });
      } catch {
        if (!cancelled) {
          setStatus({ checking: false, reachable: false, databaseReady: false });
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return status;
};

export default useApiStatus;
