// WomenConnect Hub - Project Card Component
// Individual project display with Google Drive media support

import React, { useState } from 'react';
import Button from '../common/Button';
import { formatCurrency, truncateText, timeAgo } from '../../utils/helpers';
import { validateAndConvertGoogleDriveLink } from '../../utils/linkUtils';

const ProjectCard = ({ 
  project, 
  onViewDetails, 
  onContact, 
  onInvest,
  showActions = true,
  layout = 'grid' // 'grid' or 'list'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const {
    id,
    title,
    description,
    businessName,
    category,
    location,
    fundingGoal,
    fundingRaised = 0,
    images = [],
    sellerName,
    sellerAvatar,
    createdAt,
    status = 'active',
    isFeatured = false
  } = project;

  const fundingPercentage = fundingGoal > 0 ? Math.min((fundingRaised / fundingGoal) * 100, 100) : 0;
  const mainImage = images[0] ? validateAndConvertGoogleDriveLink(images[0]) : null;

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(project);
    }
  };

  const handleContact = () => {
    if (onContact) {
      onContact(project);
    }
  };

  const handleInvest = () => {
    if (onInvest) {
      onInvest(project);
    }
  };

  const renderImage = () => (
    <div className="project-image-container">
      {isFeatured && (
        <div className="featured-badge">
          <span>⭐ Featured</span>
        </div>
      )}
      
      {isImageLoading && (
        <div className="image-skeleton">
          <div className="skeleton-animation"></div>
        </div>
      )}
      
      {mainImage && !imageError ? (
        <img
          src={mainImage}
          alt={`${title} - Project Image`}
          className="project-image"
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        <div className="image-placeholder">
          <div className="placeholder-icon">🏢</div>
          <span>No Image</span>
        </div>
      )}
      
      <div className="image-overlay">
        <Button
          variant="secondary"
          size="small"
          onClick={handleViewDetails}
          className="view-details-btn"
        >
          View Details
        </Button>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="project-content">
      <div className="project-header">
        <div className="project-meta">
          <span className="business-name">{businessName}</span>
          <span className="project-location">📍 {location}</span>
        </div>
        <div className="project-category">
          <span className="category-tag">{category}</span>
        </div>
      </div>

      <h3 className="project-title" onClick={handleViewDetails}>
        {title}
      </h3>

      <p className="project-description">
        {truncateText(description, layout === 'grid' ? 120 : 200)}
      </p>

      <div className="funding-section">
        <div className="funding-info">
          <div className="funding-raised">
            <strong>{formatCurrency(fundingRaised)}</strong>
            <span> raised of {formatCurrency(fundingGoal)}</span>
          </div>
          <div className="funding-percentage">
            {fundingPercentage.toFixed(0)}% funded
          </div>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${fundingPercentage}%` }}
            aria-label={`${fundingPercentage}% funded`}
          ></div>
        </div>
      </div>

      <div className="project-footer">
        <div className="seller-info">
          {sellerAvatar ? (
            <img 
              src={validateAndConvertGoogleDriveLink(sellerAvatar)} 
              alt={sellerName}
              className="seller-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="seller-avatar-placeholder" style={{ display: sellerAvatar ? 'none' : 'flex' }}>
            {sellerName?.charAt(0).toUpperCase()}
          </div>
          <div className="seller-details">
            <span className="seller-name">{sellerName}</span>
            <span className="project-date">{timeAgo(createdAt)}</span>
          </div>
        </div>

        {showActions && (
          <div className="project-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={handleContact}
              className="contact-btn"
            >
              Contact
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={handleInvest}
              className="invest-btn"
            >
              Invest
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <article className={`project-card ${layout}-layout ${status}`}>
      {layout === 'grid' ? (
        <>
          {renderImage()}
          {renderContent()}
        </>
      ) : (
        <div className="list-content">
          <div className="list-image">
            {renderImage()}
          </div>
          <div className="list-details">
            {renderContent()}
          </div>
        </div>
      )}

      <style jsx>{`
        .project-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .project-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .project-card.inactive {
          opacity: 0.7;
        }

        /* Grid Layout */
        .grid-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* List Layout */
        .list-layout {
          cursor: default;
        }

        .list-content {
          display: flex;
          gap: 1rem;
          padding: 1rem;
        }

        .list-image {
          flex-shrink: 0;
          width: 200px;
          height: 150px;
        }

        .list-details {
          flex: 1;
          min-width: 0;
        }

        /* Image Container */
        .project-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .list-layout .project-image-container {
          height: 100%;
          border-radius: 8px;
        }

        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .project-card:hover .project-image {
          transform: scale(1.05);
        }

        .image-skeleton {
          width: 100%;
          height: 100%;
          background: #e5e7eb;
          position: relative;
          overflow: hidden;
        }

        .skeleton-animation {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: skeleton-loading 1.5s infinite;
        }

        @keyframes skeleton-loading {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          color: #9ca3af;
        }

        .placeholder-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .featured-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .project-card:hover .image-overlay {
          opacity: 1;
        }

        /* Content */
        .project-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }

        .list-layout .project-content {
          padding: 0;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .project-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
          flex: 1;
        }

        .business-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.875rem;
        }

        .project-location {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .project-category {
          flex-shrink: 0;
        }

        .category-tag {
          background: #eff6ff;
          color: #2563eb;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .project-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          line-height: 1.3;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .project-title:hover {
          color: #2563eb;
        }

        .project-description {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
        }

        /* Funding Section */
        .funding-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .funding-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .funding-raised strong {
          color: #059669;
          font-weight: 700;
        }

        .funding-raised span {
          color: #6b7280;
        }

        .funding-percentage {
          color: #374151;
          font-weight: 600;
        }

        .progress-bar {
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        /* Footer */
        .project-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-top: auto;
        }

        .seller-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
          flex: 1;
        }

        .seller-avatar,
        .seller-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .seller-avatar-placeholder {
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .seller-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .seller-name {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .project-date {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .project-actions {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .list-content {
            flex-direction: column;
          }

          .list-image {
            width: 100%;
            height: 200px;
          }

          .project-actions {
            flex-direction: column;
            width: 100%;
          }

          .project-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .seller-info {
            justify-content: center;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .project-card {
            background: #1f2937;
            border: 1px solid #374151;
          }

          .business-name,
          .project-title {
            color: #f3f4f6;
          }

          .project-description {
            color: #d1d5db;
          }

          .image-placeholder {
            background: #374151;
            color: #9ca3af;
          }

          .category-tag {
            background: #1e3a8a;
            color: #93c5fd;
          }

          .seller-name {
            color: #e5e7eb;
          }

          .seller-avatar-placeholder {
            background: #4b5563;
            color: #d1d5db;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .project-card {
            border: 2px solid #000000;
          }

          .category-tag {
            border: 1px solid currentColor;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .project-card,
          .project-image,
          .project-title {
            transition: none;
          }

          .project-card:hover {
            transform: none;
          }

          .project-card:hover .project-image {
            transform: none;
          }

          .skeleton-animation {
            animation: none;
          }
        }

        /* Print styles */
        @media print {
          .project-card {
            break-inside: avoid;
            box-shadow: none;
            border: 1px solid #000000;
          }

          .image-overlay,
          .project-actions {
            display: none;
          }
        }
      `}</style>
    </article>
  );
};

export default ProjectCard;
