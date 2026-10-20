import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CustomerSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await api.authSignup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (response.success) {
        localStorage.setItem('moorthi_token', response.data.token);
        localStorage.setItem('moorthi_user', JSON.stringify(response.data.user));
        window.dispatchEvent(new Event('storage'));

        setSuccessMessage('Account created successfully! Redirecting to your dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        if (response.errors && response.errors.length > 0) {
          const errorMap = {};
          response.errors.forEach(error => {
            errorMap[error.field] = error.message;
          });
          setErrors(errorMap);
        } else {
          setErrors({ general: response.message || 'Signup failed. Please verify your details.' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Network connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        {/* Main Card */}
        <div style={{
          backgroundColor: '#FFFCF7',
          borderRadius: '16px',
          border: '1px solid #E8DCCF',
          boxShadow: '0 8px 30px rgba(52,35,29,0.08)',
          overflow: 'hidden'
        }}>
          
          {/* Card Header */}
          <div style={{ padding: '2rem 2rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #f0e6dc' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#F7E6D8',
              color: '#C65D35',
              marginBottom: '0.75rem'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>person_add</span>
            </div>
            <h1 style={{
              fontFamily: 'Noto Serif, Georgia, serif',
              fontSize: '1.75rem',
              color: '#2b1f1d',
              margin: '0 0 0.35rem'
            }}>
              Join Hotel New Moorthi Cafe
            </h1>
            <p style={{ margin: 0, color: '#6c584c', fontSize: '0.9rem' }}>
              Create your customer dining account for faster counter pickup
            </p>
          </div>

          {/* Form Body */}
          <div style={{ padding: '1.75rem 2rem' }}>
            
            {successMessage && (
              <div style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(10, 108, 68, 0.1)',
                border: '1px solid #0a6c44',
                borderRadius: '8px',
                color: '#0a6c44',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

            {(errors.general || Object.keys(errors).length > 0) && (
              <div style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#ffebee',
                border: '1px solid #d32f2f',
                borderRadius: '8px',
                color: '#c62828',
                fontSize: '0.9rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>error</span>
                <span>{errors.general || Object.values(errors)[0]}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div>
                <label htmlFor="name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2b1f1d', marginBottom: '0.4rem' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0.85rem', color: '#8a7268', fontSize: '20px' }}>
                    person
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sundaram Natarajan"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                      borderRadius: '8px',
                      border: '1px solid #E8DCCF',
                      backgroundColor: '#FFF8EE',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                {errors.name && (
                  <span style={{ color: '#c62828', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>
                )}
              </div>

              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2b1f1d', marginBottom: '0.4rem' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0.85rem', color: '#8a7268', fontSize: '20px' }}>
                    mail
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sundaram@domain.com"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                      borderRadius: '8px',
                      border: '1px solid #E8DCCF',
                      backgroundColor: '#FFF8EE',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                {errors.email && (
                  <span style={{ color: '#c62828', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>
                )}
              </div>

              <div>
                <label htmlFor="phone" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2b1f1d', marginBottom: '0.4rem' }}>
                  10-Digit Mobile Number *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0.85rem', color: '#8a7268', fontSize: '20px' }}>
                    call
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.75rem 0.85rem 0.75rem 2.6rem',
                      borderRadius: '8px',
                      border: '1px solid #E8DCCF',
                      backgroundColor: '#FFF8EE',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                {errors.phone && (
                  <span style={{ color: '#c62828', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.phone}</span>
                )}
              </div>

              <div>
                <label htmlFor="password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2b1f1d', marginBottom: '0.4rem' }}>
                  Password * (Min 8 Characters)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0.85rem', color: '#8a7268', fontSize: '20px' }}>
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    required
                    minLength={8}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.75rem 2.6rem 0.75rem 2.6rem',
                      borderRadius: '8px',
                      border: '1px solid #E8DCCF',
                      backgroundColor: '#FFF8EE',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#8a7268',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <span style={{ color: '#c62828', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.password}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  backgroundColor: '#C65D35',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(198,93,53,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s',
                  marginTop: '0.5rem'
                }}
              >
                <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                {!loading && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>}
              </button>

            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f0e6dc' }}>
              <span style={{ color: '#6c584c', fontSize: '0.9rem' }}>Already registered? </span>
              <Link to="/login" style={{ color: '#C65D35', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                Sign In to Your Account
              </Link>
            </div>

          </div>

          {/* Card Footer Assurance */}
          <div style={{
            backgroundColor: '#FFF8EE',
            padding: '0.85rem 1.5rem',
            borderTop: '1px solid #E8DCCF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#6c584c'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0a6c44' }}></span>
              <span style={{ fontWeight: 600, color: '#0a6c44' }}>100% Satvik Pure Veg</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#0a6c44' }}>verified</span>
              <span>Express Counter Pickup</span>
            </div>
          </div>

        </div>

        {/* Heritage Foothold */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', color: '#8a7268', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>temple_hindu</span>
          <span>East Car Street, Chidambaram • Estd. 1978</span>
        </div>

      </div>
    </div>
  );
};

export default CustomerSignup;