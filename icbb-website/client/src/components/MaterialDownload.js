import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiLock, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useParticipantAuth } from '../context/ParticipantAuth';
import './MaterialDownload.css';

/**
 * Download button for a paid course file.
 *
 * The file is streamed by the API, which checks the participant's token and
 * whether they have paid. A plain <a href> cannot carry an Authorization
 * header, so the file is fetched, turned into a blob and saved from there.
 */
const MaterialDownload = ({ folder, file, label, note, icon, courseId }) => {
  const { isSignedIn, authFetch } = useParticipantAuth();
  const [state, setState] = useState('idle'); // idle | working | error
  const [message, setMessage] = useState(null);

  const download = async () => {
    setState('working');
    setMessage(null);

    try {
      const response = await authFetch(`/api/materials/${folder}/${file}`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        if (response.status === 402) {
          setMessage(data.message || 'Complete your payment to download this file.');
        } else if (response.status === 403) {
          setMessage(data.message || 'Enrol in this course to download this file.');
        } else {
          setMessage(data.message || 'Could not download the file.');
        }

        setState('error');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = file;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Release the object URL once the browser has taken the data.
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      setState('idle');
    } catch (error) {
      setMessage(error.message || 'Could not download the file.');
      setState('error');
    }
  };

  if (!isSignedIn) {
    return (
      <Link
        className="material-download is-locked"
        to="/learn/register"
        state={{ from: courseId ? `/training/${courseId}/module` : '/learn' }}
      >
        <FiLock />
        <span>
          <strong>{label}</strong>
          <small>Register to download</small>
        </span>
      </Link>
    );
  }

  return (
    <div className="material-download-wrap">
      <button
        type="button"
        className={`material-download${state === 'error' ? ' is-error' : ''}`}
        onClick={download}
        disabled={state === 'working'}
      >
        {state === 'working' ? <FiLoader className="spin" /> : (icon || <FiDownload />)}
        <span>
          <strong>{label}</strong>
          <small>{state === 'working' ? 'Preparing…' : note}</small>
        </span>
      </button>

      {message && (
        <p className="material-download-message">
          <FiAlertCircle /> {message}
        </p>
      )}
    </div>
  );
};

export default MaterialDownload;
