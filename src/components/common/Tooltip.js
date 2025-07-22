// WomenConnect Hub - Tooltip Component
// Help tooltips for guidance and accessibility

import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({
  children,
  content,
  position = 'top',
  trigger = 'hover',
  delay = 500,
  className = '',
  disabled = false,
  maxWidth = 250,
  showArrow = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  // Position options
  const positions = {
    top: 'tooltip-top',
    bottom: 'tooltip-bottom',
    left: 'tooltip-left',
    right: 'tooltip-right'
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Calculate best position based on viewport
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return position;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let bestPosition = position;

    // Check if tooltip fits in the preferred position
    switch (position) {
      case 'top':
        if (triggerRect.top < tooltipRect.height + 10) {
          bestPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height + 10 > viewportHeight) {
          bestPosition = 'top';
        }
        break;
      case 'left':
        if (triggerRect.left < tooltipRect.width + 10) {
          bestPosition = 'right';
        }
        break;
      case 'right':
        if (triggerRect.right + tooltipRect.width + 10 > viewportWidth) {
          bestPosition = 'left';
        }
        break;
    }

    return bestPosition;
  };

  const showTooltip = () => {
    if (disabled) return;

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        // Calculate position after tooltip is rendered
        setTimeout(() => {
          setActualPosition(calculatePosition());
        }, 0);
      }, delay);
    } else {
      setIsVisible(true);
      setTimeout(() => {
        setActualPosition(calculatePosition());
      }, 0);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Event handlers based on trigger type
  const getEventHandlers = () => {
    if (disabled) return {};

    switch (trigger) {
      case 'hover':
        return {
          onMouseEnter: showTooltip,
          onMouseLeave: hideTooltip,
          onFocus: showTooltip,
          onBlur: hideTooltip
        };
      case 'focus':
        return {
          onFocus: showTooltip,
          onBlur: hideTooltip
        };
      case 'click':
        return {
          onClick: (e) => {
            e.preventDefault();
            if (isVisible) {
              hideTooltip();
            } else {
              showTooltip();
            }
          }
        };
      default:
        return {};
    }
  };

  const eventHandlers = getEventHandlers();

  return (
    <div className={`tooltip-container ${className}`}>
      <div
        ref={triggerRef}
        className="tooltip-trigger"
        {...eventHandlers}
        aria-describedby={isVisible ? 'tooltip-content' : undefined}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip-content"
          className={`tooltip ${positions[actualPosition]}`}
          role="tooltip"
          style={{ maxWidth: `${maxWidth}px` }}
        >
          {content}
          {showArrow && <div className="tooltip-arrow" />}
        </div>
      )}

      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }

        .tooltip-trigger {
          display: inherit;
          cursor: help;
        }

        .tooltip {
          position: absolute;
          z-index: 1000;
          background: #1f2937;
          color: #ffffff;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius);
          font-size: var(--font-size-sm);
          line-height: 1.4;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
          animation: tooltipFadeIn 0.2s ease-out;
          word-wrap: break-word;
          hyphens: auto;
        }

        /* Position styles */
        .tooltip-top {
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
        }

        .tooltip-bottom {
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
        }

        .tooltip-left {
          right: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
        }

        .tooltip-right {
          left: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
        }

        /* Arrow styles */
        .tooltip-arrow {
          position: absolute;
          width: 0;
          height: 0;
          border: 6px solid transparent;
        }

        .tooltip-top .tooltip-arrow {
          top: 100%;
          left: 50%;
          margin-left: -6px;
          border-top-color: #1f2937;
        }

        .tooltip-bottom .tooltip-arrow {
          bottom: 100%;
          left: 50%;
          margin-left: -6px;
          border-bottom-color: #1f2937;
        }

        .tooltip-left .tooltip-arrow {
          left: 100%;
          top: 50%;
          margin-top: -6px;
          border-left-color: #1f2937;
        }

        .tooltip-right .tooltip-arrow {
          right: 100%;
          top: 50%;
          margin-top: -6px;
          border-right-color: #1f2937;
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-2px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .tooltip {
            font-size: var(--font-size-xs);
            padding: var(--spacing-xs) var(--spacing-sm);
            max-width: 200px !important;
          }

          /* Ensure tooltip doesn't go off-screen */
          .tooltip-top,
          .tooltip-bottom {
            left: 50%;
            transform: translateX(-50%);
            margin-left: 0;
          }

          /* Adjust for small screens */
          .tooltip-left {
            right: auto;
            left: 0;
            top: calc(100% + 10px);
            transform: none;
          }

          .tooltip-right {
            left: 0;
            top: calc(100% + 10px);
            transform: none;
          }

          .tooltip-left .tooltip-arrow,
          .tooltip-right .tooltip-arrow {
            display: none;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .tooltip {
            background: #000000;
            border: 2px solid #ffffff;
          }

          .tooltip-arrow {
            border-width: 8px;
          }

          .tooltip-top .tooltip-arrow {
            border-top-color: #000000;
          }

          .tooltip-bottom .tooltip-arrow {
            border-bottom-color: #000000;
          }

          .tooltip-left .tooltip-arrow {
            border-left-color: #000000;
          }

          .tooltip-right .tooltip-arrow {
            border-right-color: #000000;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .tooltip {
            animation: none;
          }

          @keyframes tooltipFadeIn {
            from, to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        }

        /* Print styles */
        @media print {
          .tooltip {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

// Icon Tooltip Component - for help icons with tooltips
export const HelpTooltip = ({ 
  content, 
  position = 'top',
  className = '',
  iconSize = 'small'
}) => {
  const sizeClasses = {
    small: 'help-icon-small',
    medium: 'help-icon-medium',
    large: 'help-icon-large'
  };

  return (
    <Tooltip content={content} position={position} className={className}>
      <span 
        className={`help-icon ${sizeClasses[iconSize]}`}
        role="img" 
        aria-label="Help"
      >
        ❓
      </span>

      <style jsx>{`
        .help-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
          border-radius: 50%;
          cursor: help;
          transition: all 0.2s ease;
          color: #6b7280;
        }

        .help-icon:hover,
        .help-icon:focus {
          background: #d1d5db;
          color: #374151;
        }

        .help-icon-small {
          width: 16px;
          height: 16px;
          font-size: 10px;
        }

        .help-icon-medium {
          width: 20px;
          height: 20px;
          font-size: 12px;
        }

        .help-icon-large {
          width: 24px;
          height: 24px;
          font-size: 14px;
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .help-icon {
            background: #4b5563;
            color: #9ca3af;
          }

          .help-icon:hover,
          .help-icon:focus {
            background: #6b7280;
            color: #d1d5db;
          }
        }
      `}</style>
    </Tooltip>
  );
};

// Info Tooltip Component - for informational content
export const InfoTooltip = ({ 
  content, 
  children, 
  position = 'top',
  variant = 'info',
  className = ''
}) => {
  const variants = {
    info: { bg: '#dbeafe', color: '#1e40af', icon: 'ℹ️' },
    warning: { bg: '#fef3c7', color: '#92400e', icon: '⚠️' },
    success: { bg: '#d1fae5', color: '#065f46', icon: '✅' },
    error: { bg: '#fee2e2', color: '#991b1b', icon: '❌' }
  };

  const style = variants[variant];

  return (
    <Tooltip 
      content={
        <div className="info-tooltip-content">
          <span className="info-icon">{style.icon}</span>
          <span>{content}</span>
        </div>
      } 
      position={position} 
      className={className}
    >
      {children}

      <style jsx>{`
        .info-tooltip-content {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .info-icon {
          flex-shrink: 0;
        }
      `}</style>
    </Tooltip>
  );
};

export default Tooltip;
