// WomenConnect Hub - Card Component
// Reusable card wrapper component

import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = true,
  hover = false,
  clickable = false,
  variant = 'default',
  onClick,
  as = 'div',
  ...props 
}) => {
  const Component = as;

  const baseClasses = 'card';
  const variantClasses = {
    default: 'card-default',
    elevated: 'card-elevated',
    bordered: 'card-bordered',
    flat: 'card-flat'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    !padding && 'card-no-padding',
    hover && 'card-hover',
    clickable && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <Component
      className={classes}
      onClick={clickable ? handleClick : onClick}
      onKeyDown={clickable ? handleKeyDown : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      {...props}
    >
      {children}

      <style jsx>{`
        .card {
          background: #ffffff;
          border-radius: var(--border-radius);
          transition: all 0.2s ease;
          overflow: hidden;
          position: relative;
        }

        .card-default {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .card-elevated {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
          border: 1px solid #f3f4f6;
        }

        .card-bordered {
          box-shadow: none;
          border: 2px solid #e5e7eb;
        }

        .card-flat {
          box-shadow: none;
          border: none;
        }

        .card:not(.card-no-padding) {
          padding: var(--spacing-lg);
        }

        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .card-clickable {
          cursor: pointer;
        }

        .card-clickable:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .card-clickable:focus {
          outline: var(--focus-ring);
          outline-offset: 2px;
        }

        .card-clickable:active {
          transform: translateY(-1px);
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .card:not(.card-no-padding) {
            padding: var(--spacing-md);
          }

          .card-hover:hover,
          .card-clickable:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .card-default,
          .card-elevated {
            border: 2px solid #000000;
          }

          .card-bordered {
            border-color: #000000;
            border-width: 3px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .card {
            transition: none;
          }

          .card-hover:hover,
          .card-clickable:hover,
          .card-clickable:active {
            transform: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .card {
            background: #1f2937;
            color: #f3f4f6;
          }

          .card-default {
            border-color: #374151;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .card-elevated {
            border-color: #4b5563;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .card-bordered {
            border-color: #4b5563;
          }
        }

        /* Print styles */
        @media print {
          .card {
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #000000 !important;
            box-shadow: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </Component>
  );
};

// Project Card Component - specialized for project displays
export const ProjectCard = ({ 
  project,
  onClick,
  className = '',
  showActions = false,
  actions = null,
  ...props
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(project);
    }
  };

  return (
    <Card
      className={`project-card ${className}`}
      clickable={!!onClick}
      onClick={handleCardClick}
      padding={false}
      hover={!!onClick}
      {...props}
    >
      {/* Project Image */}
      {project?.image && (
        <div className="project-image-container">
          <img
            src={project.image}
            alt={project.title}
            className="project-image"
            loading="lazy"
          />
        </div>
      )}

      {/* Project Content */}
      <div className="project-content">
        <h3 className="project-title">
          {project?.title}
        </h3>
        
        {project?.description && (
          <p className="project-description">
            {project.description.substring(0, 150)}
            {project.description.length > 150 && '...'}
          </p>
        )}

        {/* Project Meta */}
        <div className="project-meta">
          {project?.category && (
            <span className="project-category">
              {project.category}
            </span>
          )}
          
          {project?.location && (
            <span className="project-location">
              📍 {project.location}
            </span>
          )}
        </div>

        {/* Project Actions */}
        {showActions && actions && (
          <div className="project-actions">
            {actions}
          </div>
        )}
      </div>

      <style jsx>{`
        .project-card {
          overflow: hidden;
        }

        .project-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s ease;
        }

        .project-card:hover .project-image {
          transform: scale(1.05);
        }

        .project-content {
          padding: var(--spacing-lg);
        }

        .project-title {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 var(--spacing-sm) 0;
          line-height: 1.3;
        }

        .project-description {
          color: #4b5563;
          font-size: var(--font-size-sm);
          line-height: 1.5;
          margin: 0 0 var(--spacing-md) 0;
        }

        .project-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: var(--font-size-xs);
          color: #6b7280;
          margin-bottom: var(--spacing-sm);
        }

        .project-category {
          background: #dbeafe;
          color: #2563eb;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: 12px;
          font-weight: 500;
        }

        .project-location {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .project-actions {
          display: flex;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid #e5e7eb;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .project-image-container {
            height: 160px;
          }

          .project-content {
            padding: var(--spacing-md);
          }

          .project-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-xs);
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .project-image {
            transition: none;
          }

          .project-card:hover .project-image {
            transform: none;
          }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .project-title {
            color: #f3f4f6;
          }

          .project-description {
            color: #d1d5db;
          }

          .project-meta {
            color: #9ca3af;
          }

          .project-actions {
            border-top-color: #374151;
          }
        }
      `}</style>
    </Card>
  );
};

export default Card;
