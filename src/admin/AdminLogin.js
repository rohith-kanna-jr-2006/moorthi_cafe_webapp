import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    identifier: '',
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
      const response = await api.authLogin({
        identifier: formData.identifier,
        password: formData.password
      });

      if (response.success) {
        // Store token and user data
        localStorage.setItem('moorthi_token', response.data.token);
        localStorage.setItem('moorthi_user', JSON.stringify(response.data.user));

        // Check if user is admin (role should be 'admin' based on backend)
        if (response.data.user.role === 'admin') {
          setSuccessMessage('Login successful! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1500);
        } else {
          setErrors({ general: 'Access denied. Admin privileges required.' });
          setLoading(false);
        }
      } else {
        // Handle API validation errors
        if (response.errors && response.errors.length > 0) {
          const errorMap = {};
          response.errors.forEach(error => {
            errorMap[error.field] = error.message;
          });
          setErrors(errorMap);
        } else {
          setErrors({ general: response.message || 'Login failed' });
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
          <div className="admin-login-container">
            <h1>Admin Login</h1>
            <p className="admin-login-description">Welcome, Head Cashier & Operations Manager</p>

            <div className="admin-login-details">
              <p><strong>Station ID:</strong> CHID-CTR-01</p>
              <p><strong>Shift Supervisor:</strong> Moorthi S.</p>
            </div>

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

            <div className="admin-login-actions">
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="identifier">Email or Mobile Number <span className="required-mark">*</span></label>
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter your email or mobile number"
                    required
                    className={errors.identifier ? 'error-input' : ''}
                  />
                  {errors.identifier && (
                    <span className="error-message">{errors.identifier}</span>
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
                    placeholder="Enter your password"
                    required
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
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                  <Link to="/" className="btn btn-link">
                    Back to Customer Portal
                  </Link>
                </div>
              </form>
            </div>

            <p className="admin-login-security">"Authorized personnel only • Counter #CH-01"</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;