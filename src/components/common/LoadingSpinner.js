// WomenConnect Hub - LoadingSpinner Component
// Loading states with accessibility support

import React from 'react';

const LoadingSpinner = ({
  size = 'medium',
  color = 'primary',
  text = '',
  center = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium', 
    large: 'spinner-large',
    xlarge: 'spinner-xlarge'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    success: 'spinner-success',
    warning: 'spinner-warning',
    danger: 'spinner-danger',
    light: 'spinner-light'
  };

  const spinnerClass = `loading-spinner ${sizeClasses[size]} ${colorClasses[color]} ${className}`;
  const containerClass = `spinner-container ${center ? 'spinner-center' : ''}`;

  return (
    <div className={containerClass}>
      <div 
        className={spinnerClass}
        role="status"
        aria-label={text || 'Loading'}
        aria-live="polite"
      >
        <div className="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      
      {text && (
        <span className="spinner-text" aria-hidden="true">
          {text}
        </span>
      )}

      <style jsx>{`
        .spinner-container {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex-direction: column;
        }

        .spinner-center {
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 100px;
        }

        .loading-spinner {
          position: relative;
        }

        .spinner-ring {
          display: inline-block;
          position: relative;
        }

        .spinner-ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          border: 3px solid;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: currentColor transparent transparent transparent;
        }

        .spinner-ring div:nth-child(1) {
          animation-delay: -0.45s;
        }

        .spinner-ring div:nth-child(2) {
          animation-delay: -0.3s;
        }

        .spinner-ring div:nth-child(3) {
          animation-delay: -0.15s;
        }

        /* Size variations */
        .spinner-small .spinner-ring {
          width: 16px;
          height: 16px;
        }

        .spinner-small .spinner-ring div {
          width: 16px;
          height: 16px;
          margin: 2px;
          border-width: 2px;
        }

        .spinner-medium .spinner-ring {
          width: 32px;
          height: 32px;
        }

        .spinner-medium .spinner-ring div {
          width: 32px;
          height: 32px;
          margin: 4px;
          border-width: 3px;
        }

        .spinner-large .spinner-ring {
          width: 48px;
          height: 48px;
        }

        .spinner-large .spinner-ring div {
          width: 48px;
          height: 48px;
          margin: 6px;
          border-width: 4px;
        }

        .spinner-xlarge .spinner-ring {
          width: 64px;
          height: 64px;
        }

        .spinner-xlarge .spinner-ring div {
          width: 64px;
          height: 64px;
          margin: 8px;
          border-width: 5px;
        }

        /* Color variations */
        .spinner-primary {
          color: #2563eb;
        }

        .spinner-secondary {
          color: #6b7280;
        }

        .spinner-success {
          color: #059669;
        }

        .spinner-warning {
          color: #f59e0b;
        }

        .spinner-danger {
          color: #dc2626;
        }

        .spinner-light {
          color: #ffffff;
        }

        .spinner-text {
          font-size: var(--font-size-sm);
          color: #6b7280;
          text-align: center;
          margin-top: var(--spacing-xs);
          font-weight: 500;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .spinner-ring div {
            border-width: 4px;
          }

          .spinner-small .spinner-ring div {
            border-width: 3px;
          }

          .spinner-large .spinner-ring div {
            border-width: 5px;
          }

          .spinner-xlarge .spinner-ring div {
            border-width: 6px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .spinner-ring div {
            animation: none;
            border-color: currentColor;
            opacity: 0.6;
          }

          .spinner-ring div:nth-child(1) {
            opacity: 1;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .spinner-text {
            color: #d1d5db;
          }

          .spinner-secondary {
            color: #9ca3af;
          }
        }
      `}</style>
    </div>
  );
};

// Loading Button Component - spinner inside button
export const LoadingButton = ({
  children,
  loading = false,
  disabled = false,
  className = '',
  spinnerSize = 'small',
  ...props
}) => {
  return (
    <button 
      className={`btn ${loading ? 'btn-loading' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size={spinnerSize} 
          color="light" 
          className="inline-spinner" 
        />
      )}
      <span className={loading ? 'loading-text' : ''}>
        {children}
      </span>

      <style jsx>{`
        .btn-loading {
          position: relative;
          pointer-events: ${loading ? 'none' : 'auto'};
        }

        .inline-spinner {
          margin-right: var(--spacing-sm);
        }

        .loading-text {
          opacity: ${loading ? '0.7' : '1'};
        }
      `}</style>
    </button>
  );
};

// Page Loading Component - for full page loading
export const PageLoading = ({ message = 'Loading page...' }) => {
  return (
    <div className="page-loading">
      <LoadingSpinner 
        size="large" 
        color="primary" 
        text={message}
        center={true}
      />

      <style jsx>{`
        .page-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
          width: 100%;
          padding: var(--spacing-xl);
        }
      `}</style>
    </div>
  );
};

// Skeleton Loading Component - for content placeholders
export const SkeletonLoader = ({ 
  lines = 3, 
  width = '100%',
  height = '16px',
  className = ''
}) => {
  const skeletonLines = Array.from({ length: lines }, (_, index) => index);
  
  return (
    <div className={`skeleton-container ${className}`}>
      {skeletonLines.map((_, index) => (
        <div 
          key={index}
          className="skeleton-line"
          style={{
            width: index === lines - 1 ? '70%' : width,
            height: height
          }}
        />
      ))}

      <style jsx>{`
        .skeleton-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .skeleton-line {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: var(--border-radius);
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .skeleton-line {
            animation: none;
            background: #f3f4f6;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
