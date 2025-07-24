// WomenConnect Hub - Email Verification Component
// Email verification handling

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const EmailVerification = ({ 
  email, 
  onSuccess, 
  onResendCode,
  autoVerify = false,
  verificationCode = null 
}) => {
  const { verifyEmail, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    verificationCode: verificationCode || ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'failed'

  // Auto-verify if code is provided (from URL params)
  useEffect(() => {
    if (autoVerify && verificationCode) {
      handleVerification(verificationCode);
    }
  }, [autoVerify, verificationCode]);

  // Resend timer countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-submit when 6 digits are entered
    if (numericValue.length === 6) {
      setTimeout(() => handleVerification(numericValue), 100);
    }
  };

  const validateCode = (code = formData.verificationCode) => {
    const errors = {};
    
    if (!code.trim()) {
      errors.verificationCode = 'Verification code is required';
    } else if (code.length !== 6) {
      errors.verificationCode = 'Code must be 6 digits';
    } else if (!/^\d{6}$/.test(code)) {
      errors.verificationCode = 'Code must contain only numbers';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVerification = async (code = formData.verificationCode) => {
    if (!validateCode(code)) {
      return;
    }

    try {
      await verifyEmail({
        email,
        verificationCode: code
      });
      
      setVerificationStatus('success');
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      console.error('Email verification failed:', err);
      setVerificationStatus('failed');
      setTimeout(() => setVerificationStatus('pending'), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleVerification();
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    try {
      if (onResendCode) {
        await onResendCode();
      }
      setResendTimer(60); // 60 second cooldown
    } catch (err) {
      console.error('Resend failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="email-verification-loading">
        <LoadingSpinner message="Verifying your email..." />
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="email-verification-container">
        <div className="verification-success">
          <div className="success-icon">✅</div>
          <h1>Email Verified!</h1>
          <p>Your email has been successfully verified.</p>
          <p>Redirecting you to your dashboard...</p>
        </div>
        
        <style jsx>{`
          .email-verification-container {
            max-width: 450px;
            margin: 0 auto;
            padding: 2rem;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .verification-success {
            text-align: center;
            padding: 2rem 1rem;
          }

          .success-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: bounceIn 0.6s ease-out;
          }

          .verification-success h1 {
            font-size: 1.75rem;
            font-weight: 700;
            color: #059669;
            margin: 0 0 1rem 0;
          }

          .verification-success p {
            color: #6b7280;
            margin: 0 0 0.5rem 0;
            line-height: 1.5;
          }

          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            .email-verification-container {
              background: #1f2937;
              color: #f3f4f6;
            }

            .verification-success h1 {
              color: #10b981;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="email-verification-container">
      <div className="verification-header">
        <div className="email-icon">📧</div>
        <h1>Verify Your Email</h1>
        <p>
          We've sent a 6-digit verification code to <strong>{email}</strong>
        </p>
        <p className="help-text">
          Enter the code below to activate your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="verification-form" noValidate>
        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            {error}
          </div>
        )}

        {verificationStatus === 'failed' && (
          <div className="error-message" role="alert">
            <span className="error-icon" aria-hidden="true">❌</span>
            Invalid verification code. Please try again.
          </div>
        )}

        <div className="form-group">
          <label htmlFor="verificationCode" className="form-label">
            Verification Code *
          </label>
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleInputChange}
            className={`form-input code-input ${validationErrors.verificationCode ? 'error' : ''} ${verificationStatus === 'failed' ? 'error' : ''}`}
            placeholder="000000"
            required
            maxLength="6"
            pattern="[0-9]{6}"
            autoComplete="one-time-code"
            autoFocus
            aria-describedby={validationErrors.verificationCode ? 'code-error' : 'code-help'}
          />
          {validationErrors.verificationCode && (
            <span id="code-error" className="field-error" role="alert">
              {validationErrors.verificationCode}
            </span>
          )}
          {!validationErrors.verificationCode && (
            <span id="code-help" className="field-help">
              Enter the 6-digit code from your email
            </span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          disabled={loading || formData.verificationCode.length !== 6}
        >
          Verify Email
        </Button>

        <div className="verification-actions">
          <div className="resend-section">
            <span className="resend-text">Didn't receive the code?</span>
            <button
              type="button"
              onClick={handleResendCode}
              className="resend-button"
              disabled={resendTimer > 0 || loading}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
            </button>
          </div>

          <div className="help-links">
            <a href="/contact" className="help-link">
              Need help?
            </a>
            <a href="/auth/login" className="back-link">
              Back to Login
            </a>
          </div>
        </div>
      </form>

      <div className="verification-tips">
        <h3>Not seeing the email?</h3>
        <ul>
          <li>Check your spam or junk folder</li>
          <li>Make sure {email} is correct</li>
          <li>Wait a few minutes - emails can be delayed</li>
          <li>Add noreply@womenconnecthub.com to your contacts</li>
        </ul>
      </div>

      <style jsx>{`
        .email-verification-container {
          max-width: 450px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .verification-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .email-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .verification-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .verification-header p {
          color: #6b7280;
          margin: 0 0 0.5rem 0;
          line-height: 1.5;
        }

        .help-text {
          font-size: 0.875rem;
          color: #9ca3af;
          font-style: italic;
        }

        .verification-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
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
          font-size: 1.5rem;
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
          text-align: center;
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

        .verification-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .resend-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .resend-text {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .resend-button {
          background: none;
          border: none;
          color: #2563eb;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .resend-button:hover:not(:disabled) {
          background: #eff6ff;
          text-decoration: underline;
        }

        .resend-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .help-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .help-link,
        .back-link {
          color: #2563eb;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .help-link:hover,
        .help-link:focus,
        .back-link:hover,
        .back-link:focus {
          text-decoration: underline;
          background: #eff6ff;
        }

        .verification-tips {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }

        .verification-tips h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 1rem 0;
        }

        .verification-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .verification-tips li {
          font-size: 0.875rem;
          color: #6b7280;
          padding-left: 1.5rem;
          position: relative;
        }

        .verification-tips li::before {
          content: '💡';
          position: absolute;
          left: 0;
          top: 0;
        }

        .email-verification-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .email-verification-container {
            margin: 1rem;
            padding: 1.5rem;
          }

          .verification-header h1 {
            font-size: 1.5rem;
          }

          .form-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .code-input {
            font-size: 18px;
            letter-spacing: 0.25rem;
          }

          .help-links {
            flex-direction: column;
            gap: 0.5rem;
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
          .email-verification-container {
            background: #1f2937;
            color: #f3f4f6;
          }

          .verification-header h1 {
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

          .verification-tips {
            border-top-color: #4b5563;
          }

          .verification-tips h3 {
            color: #e5e7eb;
          }

          .resend-button:hover:not(:disabled),
          .help-link:hover,
          .back-link:hover {
            background: #1e3a8a;
          }
        }

        /* Focus indicators for accessibility */
        .resend-button:focus,
        .help-link:focus,
        .back-link:focus {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .form-input,
          .resend-button,
          .help-link,
          .back-link {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default EmailVerification;
