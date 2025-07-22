// WomenConnect Hub - Modal Component
// Reusable modal with accessibility support

import React, { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  headerActions = null,
  footerActions = null
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Size configurations
  const getSizeClass = (size) => {
    const sizeMap = {
      small: 'modal-small',
      medium: 'modal-medium',
      large: 'modal-large',
      xlarge: 'modal-xlarge',
      fullscreen: 'modal-fullscreen'
    };
    return sizeMap[size] || 'modal-medium';
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement;
      
      // Focus the modal after a short delay
      const timer = setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(timer);
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to previously focused element
        if (previousFocusRef.current && previousFocusRef.current.focus) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      // Close on Escape
      if (closeOnEscape && event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }

      // Trap focus within modal
      if (event.key === 'Tab') {
        trapFocus(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trap functionality
  const trapFocus = (event) => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement) return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (closeOnOverlay && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle close button click
  const handleCloseClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`modal-content ${getSizeClass(size)} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        {/* Modal Header */}
        {(title || showCloseButton || headerActions) && (
          <div className="modal-header">
            <div className="modal-title-section">
              {title && (
                <h2 id="modal-title" className="modal-title">
                  {title}
                </h2>
              )}
            </div>
            
            <div className="modal-header-actions">
              {headerActions}
              
              {showCloseButton && (
                <button
                  className="modal-close-button"
                  onClick={handleCloseClick}
                  aria-label="Close modal"
                  type="button"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="modal-body">
          {children}
        </div>

        {/* Modal Footer */}
        {footerActions && (
          <div className="modal-footer">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
};

// Confirmation Modal Component
export const ConfirmModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default'
}) => {
  const getVariantClass = (variant) => {
    const variantMap = {
      default: 'btn-primary',
      danger: 'btn-danger',
      warning: 'btn-warning'
    };
    return variantMap[variant] || 'btn-primary';
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footerActions={
        <div className="modal-confirm-actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className={`btn ${getVariantClass(variant)}`}
            onClick={handleConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="modal-confirm-message">{message}</p>
    </Modal>
  );
};

export default Modal;
