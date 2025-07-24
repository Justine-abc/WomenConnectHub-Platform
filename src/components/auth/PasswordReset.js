// WomenConnect Hub - Password Reset Component
// Password recovery functionality

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const PasswordReset = ({ onSuccess }) => {
  const { resetPassword, loading, error } = useAuth();
  const [step, setStep] = useState('request'); // 'request', 'sent', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmail = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateReset = () => {
    const errors = {};
    
    if (!formData.resetCode.trim()) {
      errors.resetCode = 'Reset code is required';
    } else if (formData.resetCode.length !== 6) {
      errors.resetCode = 'Reset code must be 6 digits';
    }
    
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    try {
      await resetPassword({ email: formData.email, action: 'request' });
      setStep('sent');
    } catch (err) {
      console.error('Password reset request failed:', err);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!validateReset()) {
      return;
    }

    try {
      await resetPassword({
        email: formData.email,
        resetCode: formData.resetCode,
        newPassword: formData.newPassword,
        action: 'reset'
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Password reset failed:', err);
    }
  };

  const resendCode = async () => {
    try {
      await resetPassword({ email: formData.email, action: 'resend' });
    } catch (err) {
      console.error('Resend failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="password-reset-loading">
        <LoadingSpinner message={
          step === 'request' ? 'Sending reset code...' : 'Resetting password...'
        } />
      </div>
    );
  }

  const renderRequestForm = () => (
    <div className="reset-content">
      <div className="reset-header">
        <h1>Reset Your Password</h1>
        <p>Enter your email address and we'll send you a reset code</p>
      </div>

      <form onSubmit={handleRequestReset} className="reset-form" noValidate>
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
            placeholder="Enter your email address"
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

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Send Reset Code
        </Button>

        <div className="form-links">
          <a href="/auth/login" className="back-link">
            ← Back to Login
          </a>
        </div>
      </form>
    </div>
  );

  const renderCodeSentMessage = () => (
    <div className="reset-content">
      <div className="reset-header success">
        <div className="success-icon">📧</div>
        <h1>Check Your Email</h1>
        <p>
          We've sent a 6-digit reset code to <strong>{formData.email}</strong>
        </p>
        <p className="help-text">
          The code will expire in 15 minutes. Check your spam folder if you don't see it.
        </p>
      </div>

      <form onSubmit={handlePasswordReset} className="reset-form" noValidate>
        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="resetCode" className="form-label">
            Reset Code *
          </label>
          <input
            type="text"
            id="resetCode"
            name="resetCode"
            value={formData.resetCode}
            onChange={handleInputChange}
            className={`form-input code-input ${validationErrors.resetCode ? 'error' : ''}`}
            placeholder="Enter 6-digit code"
            required
            maxLength="6"
            pattern="[0-9]{6}"
            autoComplete="one-time-code"
            aria-describedby={validationErrors.resetCode ? 'resetCode-error' : undefined}
          />
          {validationErrors.resetCode && (
            <span id="resetCode-error" className="field-error" role="alert">
              {validationErrors.resetCode}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            New Password *
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.newPassword ? 'error' : ''}`}
            placeholder="Create new password"
            required
            autoComplete="new-password"
            aria-describedby={validationErrors.newPassword ? 'newPassword-error' : 'password-help'}
          />
          {validationErrors.newPassword && (
            <span id="newPassword-error" className="field-error" role="alert">
              {validationErrors.newPassword}
            </span>
          )}
          {!validationErrors.newPassword && (
            <span id="password-help" className="field-help">
              8+ characters with uppercase, lowercase, and number
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm New Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
            placeholder="Confirm new password"
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

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Reset Password
        </Button>

        <div className="form-links">
          <button
            type="button"
            onClick={resendCode}
            className="resend-link"
            disabled={loading}
          >
            Didn't receive the code? Resend
          </button>
          
          <button
            type="button"
            onClick={() => setStep('request')}
            className="back-link"
            disabled={loading}
          >
            ← Use different email
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="password-reset-container">
      {step === 'request' && renderRequestForm()}
      {step === 'sent' && renderCodeSentMessage()}

      <style jsx>{`
        .password-reset-container {
          max-width: 450px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .reset-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .reset-header {
          text-align: center;
        }

        .reset-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .reset-header p {
          color: #6b7280;
          margin: 0 0 0.5rem 0;
          line-height: 1.5;
        }

        .reset-header.success {
          margin-bottom: 1rem;
        }

        .success-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .help-text {
          font-size: 0.875rem;
          color: #9ca3af;
          font-style: italic;
        }

        .reset-form {
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

        .code-input {
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.5rem;
          font-family: 'Courier New', monospace;
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

        .form-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          margin-top: 1rem;
        }

        .back-link,
        .resend-link {
          color: #2563eb;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .back-link:hover,
        .back-link:focus,
        .resend-link:hover,
        .resend-link:focus {
          text-decoration: underline;
          background: #eff6ff;
        }

        .back-link:disabled,
        .resend-link:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-reset-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .password-reset-container {
            margin: 1rem;
            padding: 1.5rem;
          }

          .reset-header h1 {
            font-size: 1.5rem;
          }

          .form-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .code-input {
            font-size: 18px;
            letter-spacing: 0.25rem;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .form-input {
            border-width: 3px;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .password-reset-container {
            background: #1f2937;
            color: #f3f4f6;
          }

          .reset-header h1 {
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

          .back-link:hover,
          .back-link:focus,
          .resend-link:hover,
          .resend-link:focus {
            background: #1e3a8a;
          }
        }

        /* Print styles */
        @media print {
          .password-reset-container {
            box-shadow: none;
            border: 1px solid #000000;
          }
        }

        /* Focus indicators for accessibility */
        .back-link:focus,
        .resend-link:focus {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        /* Animation for success state */
        .reset-header.success {
          animation: fadeInUp 0.5s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .reset-header.success {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PasswordReset;
