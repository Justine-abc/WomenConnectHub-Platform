// WomenConnect Hub - Register Form Component
// General registration form

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const RegisterForm = ({ onSuccess, redirectPath = '/dashboard' }) => {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'seller', // Default to seller
    acceptTerms: false,
    subscribeNewsletter: true
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms acceptance
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      if (onSuccess) {
        onSuccess(redirectPath);
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="register-loading">
        <LoadingSpinner message="Creating your account..." />
      </div>
    );
  }

  return (
    <div className="register-form-container">
      <div className="register-header">
        <h1>Join WomenConnect Hub</h1>
        <p>Empower African women entrepreneurs or invest in their success</p>
      </div>

      <form onSubmit={handleSubmit} className="register-form" noValidate>
        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            {error}
          </div>
        )}

        {/* User Type Selection */}
        <div className="form-group">
          <fieldset className="user-type-fieldset">
            <legend className="form-label">I want to *</legend>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="userType"
                  value="seller"
                  checked={formData.userType === 'seller'}
                  onChange={handleInputChange}
                  className="radio-input"
                />
                <span className="radio-custom"></span>
                <div className="radio-content">
                  <strong>Share my business</strong>
                  <span>Showcase projects and connect with investors</span>
                </div>
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="userType"
                  value="investor"
                  checked={formData.userType === 'investor'}
                  onChange={handleInputChange}
                  className="radio-input"
                />
                <span className="radio-custom"></span>
                <div className="radio-content">
                  <strong>Support entrepreneurs</strong>
                  <span>Discover and invest in amazing projects</span>
                </div>
              </label>
            </div>
          </fieldset>
        </div>

        {/* Name Fields */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`form-input ${validationErrors.firstName ? 'error' : ''}`}
              placeholder="Your first name"
              required
              autoComplete="given-name"
              aria-describedby={validationErrors.firstName ? 'firstName-error' : undefined}
            />
            {validationErrors.firstName && (
              <span id="firstName-error" className="field-error" role="alert">
                {validationErrors.firstName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`form-input ${validationErrors.lastName ? 'error' : ''}`}
              placeholder="Your last name"
              required
              autoComplete="family-name"
              aria-describedby={validationErrors.lastName ? 'lastName-error' : undefined}
            />
            {validationErrors.lastName && (
              <span id="lastName-error" className="field-error" role="alert">
                {validationErrors.lastName}
              </span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.email ? 'error' : ''}`}
            placeholder="Enter your email"
            required
            autoComplete="email"
            aria-describedby={validationErrors.email ? 'email-error' : undefined}
          />
          {validationErrors.email && (
            <span id="email-error" className="field-error" role="alert">
              {validationErrors.email}
            </span>
          )}
        </div>

        {/* Password Fields */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${validationErrors.password ? 'error' : ''}`}
              placeholder="Create password"
              required
              autoComplete="new-password"
              aria-describedby={validationErrors.password ? 'password-error' : 'password-help'}
            />
            {validationErrors.password && (
              <span id="password-error" className="field-error" role="alert">
                {validationErrors.password}
              </span>
            )}
            {!validationErrors.password && (
              <span id="password-help" className="field-help">
                8+ characters with uppercase, lowercase, and number
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm password"
              required
              autoComplete="new-password"
              aria-describedby={validationErrors.confirmPassword ? 'confirmPassword-error' : undefined}
            />
            {validationErrors.confirmPassword && (
              <span id="confirmPassword-error" className="field-error" role="alert">
                {validationErrors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              className="checkbox-input"
              required
            />
            <span className="checkbox-custom"></span>
            <span>
              I accept the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> *
            </span>
          </label>
          {validationErrors.acceptTerms && (
            <span className="field-error" role="alert">
              {validationErrors.acceptTerms}
            </span>
          )}
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="subscribeNewsletter"
              checked={formData.subscribeNewsletter}
              onChange={handleInputChange}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            <span>
              Subscribe to updates and success stories from our community
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Create Account
        </Button>

        <div className="login-prompt">
          <span>Already have an account? </span>
          <a href="/auth/login" className="login-link">
            Sign in here
          </a>
        </div>
      </form>

      <style jsx>{`
        .register-form-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .register-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .register-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .register-header p {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .form-input {
          padding: 0.75rem;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
          background: #ffffff;
        }

        .form-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-input.error {
          border-color: #dc2626;
        }

        .field-error {
          color: #dc2626;
          font-size: 0.875rem;
        }

        .field-help {
          color: #6b7280;
          font-size: 0.75rem;
        }

        .error-message {
          padding: 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* User Type Selection */
        .user-type-fieldset {
          border: none;
          padding: 0;
          margin: 0;
        }

        .user-type-fieldset legend {
          margin-bottom: 1rem;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .radio-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .radio-label:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .radio-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .radio-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .radio-input:checked + .radio-custom {
          border-color: #2563eb;
          background: #2563eb;
        }

        .radio-input:checked + .radio-custom::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
        }

        .radio-input:checked ~ .radio-content {
          color: #2563eb;
        }

        .radio-label:has(.radio-input:checked) {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .radio-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .radio-content strong {
          font-weight: 600;
          color: #374151;
        }

        .radio-content span {
          font-size: 0.875rem;
          color: #6b7280;
        }

        /* Checkboxes */
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #374151;
          line-height: 1.5;
        }

        .checkbox-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .checkbox-input:checked + .checkbox-custom {
          background: #2563eb;
          border-color: #2563eb;
        }

        .checkbox-input:checked + .checkbox-custom::after {
          content: '✓';
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .checkbox-label a {
          color: #2563eb;
          text-decoration: none;
        }

        .checkbox-label a:hover {
          text-decoration: underline;
        }

        .login-prompt {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 1rem;
        }

        .login-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        .register-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .register-form-container {
            margin: 1rem;
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .radio-group {
            gap: 0.75rem;
          }

          .radio-label {
            padding: 0.75rem;
          }

          .form-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .register-form-container {
            background: #1f2937;
            color: #f3f4f6;
          }

          .register-header h1 {
            color: #f3f4f6;
          }

          .form-label {
            color: #e5e7eb;
          }

          .form-input {
            background: #374151;
            border-color: #6b7280;
            color: #f3f4f6;
          }

          .radio-label {
            border-color: #4b5563;
            background: #374151;
          }

          .radio-label:hover {
            background: #4b5563;
          }

          .error-message {
            background: #7f1d1d;
            border-color: #dc2626;
            color: #fecaca;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;
