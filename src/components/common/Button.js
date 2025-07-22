// WomenConnect Hub - Button Component
// Accessible button component (extracted from UI components)

import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false, 
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    warning: 'btn-warning'
  };
  const sizeClasses = {
    small: 'btn-small',
    medium: '',
    large: 'btn-large'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'btn-full',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
          ⏳
        </span>
      )}
      <span className={loading ? 'btn-text-loading' : ''}>
        {children}
      </span>

      <style jsx>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          min-height: var(--min-touch-target);
          min-width: var(--min-touch-target);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius);
          font-size: var(--font-size-base);
          font-weight: 600;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          font-family: inherit;
          line-height: 1;
          position: relative;
          overflow: hidden;
        }

        .btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .btn:focus {
          outline: var(--focus-ring);
          outline-offset: 2px;
        }

        /* Variant styles */
        .btn-primary {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }

        .btn-primary:hover:not(:disabled),
        .btn-primary:focus:not(:disabled) {
          background: #1d4ed8;
          border-color: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
        }

        .btn-secondary {
          background: #ffffff;
          color: #374151;
          border-color: #d1d5db;
        }

        .btn-secondary:hover:not(:disabled),
        .btn-secondary:focus:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .btn-success {
          background: #059669;
          color: #ffffff;
          border-color: #059669;
        }

        .btn-success:hover:not(:disabled),
        .btn-success:focus:not(:disabled) {
          background: #047857;
          border-color: #047857;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(5, 150, 105, 0.3);
        }

        .btn-danger {
          background: #dc2626;
          color: #ffffff;
          border-color: #dc2626;
        }

        .btn-danger:hover:not(:disabled),
        .btn-danger:focus:not(:disabled) {
          background: #b91c1c;
          border-color: #b91c1c;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
        }

        .btn-warning {
          background: #f59e0b;
          color: #ffffff;
          border-color: #f59e0b;
        }

        .btn-warning:hover:not(:disabled),
        .btn-warning:focus:not(:disabled) {
          background: #d97706;
          border-color: #d97706;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
        }

        /* Size variations */
        .btn-small {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: var(--font-size-sm);
          min-height: 36px;
        }

        .btn-large {
          padding: var(--spacing-md) var(--spacing-lg);
          font-size: var(--font-size-lg);
          min-height: 52px;
        }

        .btn-full {
          width: 100%;
        }

        /* Loading state */
        .btn-loading {
          pointer-events: none;
        }

        .btn-spinner {
          animation: spin 1s linear infinite;
        }

        .btn-text-loading {
          opacity: 0.7;
        }

        @keyframes spin {
          to { 
            transform: rotate(360deg); 
          }
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .btn {
            min-height: var(--min-touch-target);
            font-size: var(--font-size-base);
          }

          .btn-small {
            min-height: 40px;
            font-size: var(--font-size-sm);
          }

          .btn-large {
            min-height: 56px;
            font-size: var(--font-size-lg);
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .btn {
            border-width: 3px;
          }

          .btn-secondary {
            border-color: #000000;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .btn {
            transition: none;
          }

          .btn:hover:not(:disabled),
          .btn:focus:not(:disabled) {
            transform: none;
          }

          .btn-spinner {
            animation: none;
          }
        }

        /* Print styles */
        @media print {
          .btn {
            border: 1px solid #000000;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            transform: none !important;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .btn-secondary {
            background: #374151;
            color: #f3f4f6;
            border-color: #6b7280;
          }

          .btn-secondary:hover:not(:disabled),
          .btn-secondary:focus:not(:disabled) {
            background: #4b5563;
            border-color: #9ca3af;
          }
        }
      `}</style>
    </button>
  );
};

export default Button;
