// WomenConnect Hub - UI Component Structure
// Reusable UI components for consistency and accessibility

import React, { useState } from 'react';
import { processImageUrl, processVideoUrl, testImageLoad, getLinkInstructions } from '../../utils/linkUtils.js';

// Base Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false, 
  fullWidth = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger'
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
    loading && 'btn-loading'
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
      {children}
    </button>
  );
};

// Form Input Component
export const Input = ({
  label,
  error,
  helper,
  required = false,
  type = 'text',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-red-500" aria-label="required"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`form-input ${error ? 'border-red-500' : ''}`}
        aria-describedby={helper ? `${inputId}-helper` : undefined}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {helper && (
        <div id={`${inputId}-helper`} className="form-helper">
          {helper}
        </div>
      )}
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

// Card Component
export const Card = ({ 
  children, 
  className = '', 
  padding = true,
  hover = false,
  ...props 
}) => {
  const classes = [
    'card',
    !padding && 'p-0',
    hover && 'project-card',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Modal Component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium'
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content modal-${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {title && (
          <h2 id="modal-title" className="text-xl font-semibold mb-4">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div 
      className={`loading-spinner ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

// Alert Component
export const Alert = ({ 
  type = 'info', 
  children, 
  onDismiss,
  className = ''
}) => {
  const typeClasses = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  };

  return (
    <div className={`alert ${typeClasses[type]} ${className}`} role="alert">
      <div className="flex justify-between items-start">
        <div className="flex-1">{children}</div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-current hover:opacity-70"
            aria-label="Dismiss alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Container Component
export const Container = ({ 
  children, 
  size = 'default',
  className = ''
}) => {
  const sizeClasses = {
    small: 'max-w-2xl',
    default: 'container',
    large: 'max-w-6xl',
    full: 'w-full'
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto ${className}`}>
      {children}
    </div>
  );
};

// Grid Component
export const Grid = ({ 
  children, 
  columns = 1, 
  gap = 'md',
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  return (
    <div className={`grid grid-${columns} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

// Search Bar Component
export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search projects...",
  onSubmit,
  className = ''
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`search-container ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input form-input"
        aria-label="Search"
      />
    </form>
  );
};

// External Link Input Component for Images/Videos
export const LinkInput = ({
  label,
  type = 'image', // 'image' or 'video'
  value = '',
  onChange,
  error,
  helper,
  placeholder,
  showInstructions = true,
  required = false,
  ...props
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const validateLink = async (url) => {
    if (!url) return;
    
    setIsValidating(true);
    
    if (type === 'image') {
      const result = processImageUrl(url);
      if (result.isValid) {
        setPreviewUrl(result.processedUrl);
        const imageLoads = await testImageLoad(result.processedUrl);
        if (!imageLoads) {
          onChange(url, 'Image link appears to be broken. Please check and try again.');
          setPreviewUrl(null);
        } else {
          onChange(url, null);
        }
      } else {
        onChange(url, result.error);
        setPreviewUrl(null);
      }
    } else if (type === 'video') {
      const result = await processVideoUrl(url);
      if (result.isValid) {
        setPreviewUrl(result.thumbnailUrl);
        onChange(url, null);
      } else {
        onChange(url, result.error);
        setPreviewUrl(null);
      }
    }
    
    setIsValidating(false);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue, null);
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateLink(newValue);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const instructions = getLinkInstructions();
  const currentInstructions = type === 'image' ? 
    [instructions.googleDrive, instructions.general] : 
    [instructions.youtube, instructions.general];

  const inputId = `link-input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-red-500" aria-label="required"> *</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          type="url"
          value={value}
          onChange={handleChange}
          placeholder={placeholder || (type === 'image' ? 
            'Paste Google Drive or image link here...' : 
            'Paste YouTube or Vimeo link here...')}
          className={`form-input ${error ? 'border-red-500' : ''} ${isValidating ? 'pr-10' : ''}`}
          aria-describedby={helper ? `${inputId}-helper` : undefined}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        
        {isValidating && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LoadingSpinner size="small" />
          </div>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="mt-2">
          {type === 'image' ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded border"
              onError={() => setPreviewUrl(null)}
            />
          ) : (
            <img 
              src={previewUrl} 
              alt="Video thumbnail" 
              className="w-32 h-20 object-cover rounded border"
              onError={() => setPreviewUrl(null)}
            />
          )}
        </div>
      )}
      
      {helper && (
        <div id={`${inputId}-helper`} className="form-helper">
          {helper}
        </div>
      )}
      
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
      
      {/* Instructions */}
      {showInstructions && (
        <details className="mt-2">
          <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
            📋 How to share {type === 'image' ? 'images' : 'videos'}?
          </summary>
          <div className="mt-2 space-y-3">
            {currentInstructions.map((instruction, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded text-sm">
                <h4 className="font-medium text-blue-900 mb-1">
                  {instruction.title}
                </h4>
                {instruction.steps && (
                  <ol className="text-blue-800 space-y-1">
                    {instruction.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                )}
                {instruction.platforms && (
                  <ul className="text-blue-800 space-y-1">
                    {instruction.platforms.map((platform, platformIndex) => (
                      <li key={platformIndex}>{platform}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-2 py-1',
    large: 'text-base px-3 py-1'
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );        
  
};
