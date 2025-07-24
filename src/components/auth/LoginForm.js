// WomenConnect Hub - Login Form Component
// User authentication form

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const LoginForm = ({ onSuccess, redirectPath = '/dashboard' }) => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
      await login(formData);
      if (onSuccess) {
        onSuccess(redirectPath);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="login-loading">
        <LoadingSpinner message="Signing you in..." />
      </div>
    );
  }

  return (
    <div className="login-form-container">
      <div className="login-header">
        <h1>Welcome Back</h1>
        <p>Sign in to continue empowering African women entrepreneurs</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form" noValidate>
        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            {error}
          </div>
        )}

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
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            aria-describedby={validationErrors.password ? 'password-error' : undefined}
          />
          {validationErrors.password && (
            <span id="password-error" className="field-error" role="alert">
              {validationErrors.password}
            </span>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            Remember me for 30 days
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
          Sign In
        </Button>

        <div className="login-links">
          <a href="/auth/password-reset" className="forgot-password">
            Forgot your password?
          </a>
          
          <div className="signup-prompt">
            <span>New to WomenConnect Hub? </span>
            <a href="/auth/register" className="signup-link">
              Create an account
            </a>
          </div>
        </div>
      </form>

      <style jsx>{`
        .login-form-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .login-header p {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
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

        .form-input.error:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .field-error {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.25rem;
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

        .checkbox-group {
          flex-direction: row;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #374151;
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

        .checkbox-input:focus + .checkbox-custom {
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .login-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          margin-top: 1rem;
        }

        .forgot-password {
          color: #2563eb;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .forgot-password:hover,
        .forgot-password:focus {
          text-decoration: underline;
        }

        .signup-prompt {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .signup-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .signup-link:hover,
        .signup-link:focus {
          text-decoration: underline;
        }

        .login-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .login-form-container {
            margin: 1rem;
            padding: 1.5rem;
          }

          .login-header h1 {
            font-size: 1.5rem;
          }

          .form-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .form-input {
            border-width: 3px;
          }

          .checkbox-custom {
            border-width: 3px;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .login-form-container {
            background: #1f2937;
            color: #f3f4f6;
          }

          .login-header h1 {
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

          .form-input:focus {
            border-color: #3b82f6;
          }

          .error-message {
            background: #7f1d1d;
            border-color: #dc2626;
            color: #fecaca;
          }

          .signup-prompt {
            color: #9ca3af;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
