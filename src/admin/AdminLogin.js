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
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="stitch-dashboard-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="stitch-card-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        {/* Logo & Brand Crest */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center p-1 shadow-inner relative mb-4">
            <div className="w-full h-full rounded-full bg-surface-container-low flex flex-col items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
              <span className="font-label-sm text-label-sm tracking-widest text-tertiary uppercase mt-0.5 font-bold">1968</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-md">
              <span className="material-symbols-outlined text-xs">verified</span>
            </div>
          </div>
          <span className="font-label-md text-label-md tracking-widest text-primary uppercase font-bold mb-1">Authentic Culinary Heritage</span>
          <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">Hotel New Moorthi Cafe</h1>
          <p className="font-title-md text-title-md text-on-surface-variant mt-1 font-medium">Admin & Kitchen Management Portal</p>
          {/* Terminal Pill Tag */}
          <div className="mt-3 inline-flex items-center space-x-1.5 bg-surface-container px-3 py-1 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Chidambaram Central Counter Terminal #01</span>
          </div>
        </div>

        {/* Live Notice / Dynamic Alert Banner */}
        <div className="hidden mb-6 p-3.5 rounded-lg bg-surface-container-high transition-all flex items-start space-x-3" id="auth-alert">
          <span className="material-symbols-outlined text-primary text-title-lg flex-shrink-0 mt-0.5" id="auth-alert-icon">info</span>
          <div className="flex-1">
            <p className="font-title-md text-title-md font-bold text-on-surface leading-tight" id="auth-alert-title">Terminal Status</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug" id="auth-alert-desc">Authorized credentials verified for active counter operation.</p>
          </div>
        </div>

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Credential ID Field */}
          <div>
            <label className="block font-label-md text-label-md font-bold text-on-surface mb-1.5 uppercase tracking-wide" for="terminal-user-id">
              Manager / Staff ID or Registered Email
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-title-lg">badge</span>
              </div>
              <input
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                id="terminal-user-id"
                name="userId"
                placeholder="e.g. admin@hotelnewmoorthicafe.com or MGR-44"
                required
                type="text"
                value={formData.identifier}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Passcode / Security PIN Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block font-label-md text-label-md font-bold text-on-surface uppercase tracking-wide" for="terminal-passcode">
                Security Passcode / Master PIN
              </label>
              <button className="font-label-sm text-label-sm text-primary hover:underline font-semibold focus:outline-none" type="button">
                Need Help?
              </button>
            </div>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-title-lg">lock</span>
              </div>
              <input
                className="w-full pl-11 pr-12 py-3 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest tracking-widest transition-all"
                id="terminal-passcode"
                name="passcode"
                placeholder="••••••••••••"
                required
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                id="toggle-passcode-visibility"
                title="Toggle password display"
                type="button"
                onClick={togglePasswordVisibility}
              >
                <span className="material-symbols-outlined text-title-lg" id="eye-icon">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Terminal Security Option & Department Selection */}
          <div className="pt-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  checked={false}
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                  id="remember-terminal"
                  name="rememberTerminal"
                  type="checkbox"
                />
                <span className="font-body-sm text-body-sm font-medium text-on-surface">Remember this POS terminal</span>
              </label>
              <span className="flex items-center text-secondary font-label-sm text-label-sm font-bold bg-secondary-container/20 px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-sm mr-1">wifi</span> Shift Live
              </span>
            </div>
            {/* Counter Shift Selection */}
            <div className="bg-surface-container-low p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-tertiary text-title-md">wb_sunny</span>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface font-bold uppercase">Active Counter Period</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Morning Breakfast & Filter Coffee Shift</p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded font-bold">
                06:00 - 14:00
              </span>
            </div>
          </div>

          {/* Primary Terracotta Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-title-md text-title-md font-bold tracking-wide transition-all duration-200 shadow-md flex items-center justify-center space-x-2 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              disabled={loading}
            >
              <span>{loading ? 'Signing in...' : 'Sign In to Management Console'}</span>
              <span className="material-symbols-outlined text-title-lg">arrow_forward</span>
            </button>
          </div>
        </form>

        {/* Terminal Telemetry Summary */}
        <div className="mt-8 pt-6 bg-surface-container-low rounded-lg p-3.5 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Active Orders in Queue:</span>
            <span className="font-label-sm text-label-sm font-bold text-primary">28 KOT Tickets Pending</span>
          </div>
          <div className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '68%' }}></div>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-1">
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5"></span>Kitchen Display KDS-1: Online</span>
            <span>Sync: 12ms</span>
          </div>
        </div>

        {/* Official Compliance Footer */}
        <div className="bg-surface-container px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-on-surface-variant">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-secondary text-title-md">security</span>
            <span className="font-label-sm text-label-sm font-medium">Authorized personnel only • Counter #CH-01</span>
          </div>
          <div className="mt-2 sm:mt-0">
            <span className="font-label-sm text-label-sm font-bold tracking-wide uppercase text-on-surface-variant">
              FSSAI Lic: 12421004000329
            </span>
          </div>
        </div>

        {/* Regional Authenticity Signature */}
        <div className="mt-6 flex flex-col items-center space-y-1 text-center">
          <p className="font-label-md text-label-md text-on-surface-variant font-medium">
            Hotel New Moorthi Cafe • Established 1968 • South Car Street, Chidambaram
          </p>
          <div className="flex items-center space-x-3 text-on-surface-variant font-label-sm text-label-sm">
            <span className="hover:underline cursor-pointer">Terminal Diagnostic</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Thermal Bill Printer Setup</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Support Desk (+91 4144 222 189)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;