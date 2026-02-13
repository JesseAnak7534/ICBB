import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
    }}>
      <SEO 
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
      />
      <div style={{
        background: '#fff',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <h1 style={{ 
          fontSize: '6rem', 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #0066cc 0%, #00a86b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '800'
        }}>
          404
        </h1>
        <h2 style={{ 
          color: '#111827', 
          marginBottom: '1rem',
          fontSize: '1.5rem'
        }}>
          Page Not Found
        </h2>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'background 0.2s'
            }}
          >
            <FiHome /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
