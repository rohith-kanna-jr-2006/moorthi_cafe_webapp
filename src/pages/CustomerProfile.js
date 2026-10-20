import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CustomerProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('moorthi_token');
      if (!token) {
        navigate('/login?redirect=/profile');
        return;
      }

      const res = await api.authMe(token);
      if (res.success && res.data) {
        setUser(res.data.user || res.data);
      } else {
        setError('Session expired. Please log in again.');
      }
    } catch (err) {
      setError(err.message || 'Error fetching user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('moorthi_token');
    navigate('/login');
  };

  return (
    <div className="customer-profile-page page-container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--cafe-font-primary)', color: 'var(--cafe-terracotta)', fontSize: '2.25rem' }}>
          Customer Profile & Account
        </h1>
        <p style={{ color: 'var(--cafe-text-muted)' }}>
          Manage your contact credentials and takeaway order preferences.
        </p>
      </header>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading your profile details...</p>
        </div>
      ) : error ? (
        <div
          style={{
            background: 'var(--cafe-ivory)',
            border: '1px solid #e8dfd3',
            borderRadius: 'var(--surface-radius-card)',
            padding: '2.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--cafe-terracotta)' }}>{error}</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Go to Login
          </Link>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--cafe-ivory)',
            border: '1px solid #e8dfd3',
            borderRadius: 'var(--surface-radius-panel)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--cafe-terracotta)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                fontFamily: 'var(--cafe-font-primary)',
              }}
            >
              {(user?.name || 'C')[0].toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '0 0 4px', fontSize: '1.6rem' }}>
                {user?.name || 'Customer'}
              </h2>
              <span style={{ color: 'var(--cafe-text-muted)', fontSize: '0.95rem' }}>
                Role: <strong>{user?.role || 'Customer'}</strong> • Member since{' '}
                {new Date(user?.createdAt || Date.now()).toLocaleDateString([], { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e8dfd3', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <div style={{ fontSize: '1.1rem', fontWeight: '500', marginTop: '2px' }}>{user?.email || '—'}</div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Phone Number
              </label>
              <div style={{ fontSize: '1.1rem', fontWeight: '500', marginTop: '2px' }}>{user?.phone || '—'}</div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)', display: 'block', textTransform: 'uppercase' }}>
                Preferred Counter Pickup Outlet
              </label>
              <div style={{ fontSize: '1.05rem', fontWeight: '500', marginTop: '2px', color: 'var(--cafe-leaf)' }}>
                📍 Hotel New Moorthi Cafe — Chidambaram Main Branch
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e8dfd3', marginTop: '2rem', paddingTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/my-orders" className="btn btn-primary">
              View Order History
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Customer Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ marginLeft: 'auto', color: '#c53030', borderColor: '#c53030' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
