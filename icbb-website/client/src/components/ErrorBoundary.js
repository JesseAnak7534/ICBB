import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Log error to console (could send to error tracking service)
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: '#fff',
            padding: '3rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxWidth: '500px'
          }}>
            <h1 style={{ 
              fontSize: '4rem', 
              marginBottom: '1rem',
              color: '#ef4444'
            }}>
              ⚠️
            </h1>
            <h2 style={{ 
              color: '#111827', 
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Something went wrong
            </h2>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#0066cc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
