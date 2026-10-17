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

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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
        // Store token and user data
        localStorage.setItem('moorthi_token', response.data.token);
        localStorage.setItem('moorthi_user', JSON.stringify(response.data.user));

        setSuccessMessage('Account created successfully! Redirecting to home...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Handle API validation errors
        if (response.errors && response.errors.length > 0) {
          const errorMap = {};
          response.errors.forEach(error => {
            errorMap[error.field] = error.message;
          });
          setErrors(errorMap);
        } else {
          setErrors({ general: response.message || 'Signup failed' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--cream">
          <div className="customer-signup-container">
            <h1>Join Hotel New Moorthi Cafe</h1>
            <p className="customer-signup-description">Create your dining account to start ordering</p>

            {successMessage && (
              <div className="alert alert-success">
                {successMessage}
              </div>
            )}

            {Object.keys(errors).length > 0 && (
              <div className="alert alert-error">
                {errors.general || Object.values(errors)[0]}
              </div>
            )}

            <div className="customer-signup-actions">
              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name <span className="required-mark">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className={errors.name ? 'error-input' : ''}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address <span className="required-mark">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    className={errors.email ? 'error-input' : ''}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Mobile Number <span className="required-mark">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your 10-digit mobile number"
                    required
                    className={errors.phone ? 'error-input' : ''}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password <span className="required-mark">*</span></label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    required
                    minLength={8}
                    className={errors.password ? 'error-input' : ''}
                  />
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </button>
                  <Link to="/login" className="btn btn-link">
                    Already have an account? Login
                  </Link>
                </div>
              </form>
            </div>

            <p className="customer-signup-security">"Secure account • Protected dining profile"</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CustomerSignup;