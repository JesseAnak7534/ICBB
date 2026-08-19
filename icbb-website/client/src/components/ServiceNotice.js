import React from 'react';
import { FiClock, FiWifiOff } from 'react-icons/fi';
import useApiStatus from '../hooks/useApiStatus';
import './ServiceNotice.css';

/**
 * Explains, before someone fills in a form, that it cannot be submitted yet.
 *
 * Two states worth telling apart:
 *  - the API cannot be reached at all
 *  - the API is running but has no database, so nothing can be saved
 *
 * `children` render only when submissions can actually succeed, so a form
 * wrapped in this is never shown in a state where it would fail. The whole
 * notice disappears on its own once the database is configured.
 */
const ServiceNotice = ({ children, action = 'Registration' }) => {
  const { checking, reachable, databaseReady } = useApiStatus();

  // Say nothing until we know — a flash of "unavailable" that corrects itself
  // is worse than a brief pause.
  if (checking) return null;

  if (reachable && databaseReady) return <>{children}</>;

  return (
    <div className="service-notice" role="status">
      <div className="service-notice-icon">
        {reachable ? <FiClock /> : <FiWifiOff />}
      </div>
      <div>
        <h3>{action} is not open yet</h3>
        {reachable ? (
          <p>
            The site is running, but accounts are not switched on yet, so nothing
            you submit here could be saved. {action} will open shortly — please
            check back, or email{' '}
            <a href="mailto:info@icbb-gh.com">info@icbb-gh.com</a> and we will let
            you know.
          </p>
        ) : (
          <p>
            We cannot reach our servers at the moment, so {action.toLowerCase()} is
            unavailable. Please try again shortly, or email{' '}
            <a href="mailto:info@icbb-gh.com">info@icbb-gh.com</a>.
          </p>
        )}
      </div>
    </div>
  );
};

export default ServiceNotice;
