import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="forgot-password-page page-container" style={{ padding: '4rem 1rem', maxWidth: '480px' }}>
      <div
        style={{
          background: 'var(--cafe-ivory)',
          border: '1px solid #e8dfd3',
          borderRadius: 'var(--surface-radius-panel)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(192, 86, 33, 0.1)',
              color: 'var(--cafe-terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
              lock_reset
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--cafe-font-primary)', color: 'var(--cafe-terracotta)', fontSize: '1.75rem', margin: 0 }}>
            Reset Password
          </h1>
          <p style={{ color: 'var(--cafe-text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Enter your registered email address or phone number to receive recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: 'rgba(10, 108, 68, 0.08)',
                color: 'var(--cafe-leaf)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
              }}
            >
              Password recovery verification link and OTP have been dispatched to <strong>{identifier}</strong>.
            </div>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', boxSizing: 'border-box' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '6px' }}>
                Email Address or Phone Number
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. anand@example.com or 9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem', fontWeight: 'bold' }}
            >
              {loading ? 'Sending...' : 'Send Recovery OTP'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              <Link to="/login" style={{ color: 'var(--cafe-terracotta)', textDecoration: 'none' }}>
                ← Remembered password? Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
