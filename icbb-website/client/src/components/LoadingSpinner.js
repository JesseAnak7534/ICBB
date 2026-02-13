import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #e5e7eb',
        borderTopColor: '#0066cc',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: '#6b7280', fontSize: '1rem' }}>{message}</p>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
