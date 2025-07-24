// WomenConnect Hub - Project Details Component
// Detailed project view with Google Drive media support

import React, { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { formatCurrency, timeAgo } from '../../utils/helpers';
import { validateAndConvertGoogleDriveLink } from '../../utils/linkUtils';

const ProjectDetails = ({ 
  project, 
  onContact, 
  onInvest, 
  onEdit,
  onClose,
  currentUser = null,
  isOwner = false 
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const {
    id,
    title,
    description,
    fullDescription,
    businessName,
    category,
    location,
    fundingGoal,
    fundingRaised = 0,
    images = [],
    videos = [],
    sellerName,
    sellerAvatar,
    sellerBio,
    sellerContact,
    businessPlan,
    milestones = [],
    updates = [],
    createdAt,
    status = 'active',
    isFeatured = false,
    tags = []
  } = project;

  const fundingPercentage = fundingGoal > 0 ? Math.min((fundingRaised / fundingGoal) * 100, 100) : 0;
  const remainingFunding = Math.max(fundingGoal - fundingRaised, 0);

  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const handleImageClick = (index) => {
    setActiveImageIndex(index);
    setShowImageModal(true);
  };

  const handleContact = () => {
    if (onContact) {
      onContact(project);
    } else {
      setShowContactModal(true);
    }
  };

  const handleInvest = () => {
    if (onInvest) {
      onInvest(project);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(project);
    }
  };

  const renderMediaGallery = () => {
    const allMedia = [
      ...images.map((img, index) => ({ type: 'image', url: img, index })),
      ...videos.map((vid, index) => ({ type: 'video', url: vid, index: images.length + index }))
    ];

    if (allMedia.length === 0) {
      return (
        <div className="media-placeholder">
          <div className="placeholder-icon">🏢</div>
          <p>No images or videos available</p>
        </div>
      );
    }

    return (
      <div className="media-gallery">
        <div className="main-media">
          {allMedia[activeImageIndex]?.type === 'image' ? (
            <img
              src={validateAndConvertGoogleDriveLink(allMedia[activeImageIndex].url)}
              alt={`${title} - Image ${activeImageIndex + 1}`}
              className="main-image"
              onClick={() => setShowImageModal(true)}
              onError={() => handleImageError(activeImageIndex)}
            />
          ) : (
            <div className="video-container">
              <iframe
                src={validateAndConvertGoogleDriveLink(allMedia[activeImageIndex].url, 'video')}
                title={`${title} - Video ${activeImageIndex + 1 - images.length}`}
                className="main-video"
                allowFullScreen
              ></iframe>
            </div>
          )}
          
          {isFeatured && (
            <div className="featured-badge">
              <span>⭐ Featured Project</span>
            </div>
          )}
        </div>

        {allMedia.length > 1 && (
          <div className="media-thumbnails">
            {allMedia.map((media, index) => (
              <button
                key={index}
                className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(index)}
              >
                {media.type === 'image' ? (
                  <img
                    src={validateAndConvertGoogleDriveLink(media.url)}
                    alt={`Thumbnail ${index + 1}`}
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="video-thumbnail">
                    <span className="play-icon">▶️</span>
                    Video
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderProjectInfo = () => (
    <div className="project-info">
      <div className="project-header">
        <div className="title-section">
          <h1 className="project-title">{title}</h1>
          <div className="project-meta">
            <span className="business-name">{businessName}</span>
            <span className="location">📍 {location}</span>
            <span className="category-tag">{category}</span>
          </div>
        </div>
        
        {isOwner && (
          <div className="owner-actions">
            <Button variant="secondary" onClick={handleEdit}>
              Edit Project
            </Button>
          </div>
        )}
      </div>

      <div className="funding-section">
        <div className="funding-stats">
          <div className="stat">
            <div className="stat-value">{formatCurrency(fundingRaised)}</div>
            <div className="stat-label">Raised</div>
          </div>
          <div className="stat">
            <div className="stat-value">{formatCurrency(fundingGoal)}</div>
            <div className="stat-label">Goal</div>
          </div>
          <div className="stat">
            <div className="stat-value">{fundingPercentage.toFixed(0)}%</div>
            <div className="stat-label">Funded</div>
          </div>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${fundingPercentage}%` }}
          ></div>
        </div>
        
        <div className="funding-details">
          <p className="remaining-funding">
            <strong>{formatCurrency(remainingFunding)}</strong> remaining to reach goal
          </p>
        </div>
      </div>

      {!isOwner && (
        <div className="action-buttons">
          <Button 
            variant="secondary" 
            size="large" 
            onClick={handleContact}
            fullWidth
          >
            Contact Entrepreneur
          </Button>
          <Button 
            variant="primary" 
            size="large" 
            onClick={handleInvest}
            fullWidth
          >
            Invest Now
          </Button>
        </div>
      )}

      <div className="description-section">
        <h3>About This Project</h3>
        <p className="description">{description}</p>
        
        {fullDescription && fullDescription !== description && (
          <div className="full-description">
            <h4>Detailed Description</h4>
            <div className="description-content">
              {fullDescription.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="tags-section">
          <h4>Tags</h4>
          <div className="tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSellerInfo = () => (
    <div className="seller-section">
      <h3>About the Entrepreneur</h3>
      <div className="seller-card">
        <div className="seller-header">
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
          <div 
            className="seller-avatar-placeholder" 
            style={{ display: sellerAvatar ? 'none' : 'flex' }}
          >
            {sellerName?.charAt(0).toUpperCase()}
          </div>
          <div className="seller-info">
            <h4 className="seller-name">{sellerName}</h4>
            <p className="seller-title">Founder & CEO</p>
          </div>
        </div>
        
        {sellerBio && (
          <div className="seller-bio">
            <p>{sellerBio}</p>
          </div>
        )}
        
        <div className="seller-stats">
          <div className="stat">
            <span className="stat-label">Member since</span>
            <span className="stat-value">{timeAgo(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMilestones = () => {
    if (!milestones || milestones.length === 0) return null;

    return (
      <div className="milestones-section">
        <h3>Project Milestones</h3>
        <div className="milestones">
          {milestones.map((milestone, index) => (
            <div key={index} className={`milestone ${milestone.completed ? 'completed' : ''}`}>
              <div className="milestone-icon">
                {milestone.completed ? '✅' : '⏳'}
              </div>
              <div className="milestone-content">
                <h4>{milestone.title}</h4>
                <p>{milestone.description}</p>
                {milestone.targetDate && (
                  <span className="milestone-date">
                    Target: {new Date(milestone.targetDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="project-details">
      <div className="project-content">
        <div className="media-column">
          {renderMediaGallery()}
        </div>
        
        <div className="info-column">
          {renderProjectInfo()}
          {renderSellerInfo()}
          {renderMilestones()}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && images[activeImageIndex] && (
        <Modal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          size="xlarge"
          showCloseButton={true}
        >
          <div className="image-modal">
            <img
              src={validateAndConvertGoogleDriveLink(images[activeImageIndex])}
              alt={`${title} - Full size`}
              className="modal-image"
            />
          </div>
        </Modal>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <Modal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          title="Contact Entrepreneur"
          size="medium"
        >
          <div className="contact-modal">
            <p>To contact {sellerName} about "{title}", please use one of the following methods:</p>
            <div className="contact-methods">
              {sellerContact?.email && (
                <a href={`mailto:${sellerContact.email}?subject=Interest in ${title}`} className="contact-method">
                  📧 Send Email
                </a>
              )}
              {sellerContact?.phone && (
                <a href={`tel:${sellerContact.phone}`} className="contact-method">
                  📞 Call Phone
                </a>
              )}
              {sellerContact?.whatsapp && (
                <a href={`https://wa.me/${sellerContact.whatsapp}?text=Hi, I'm interested in your project "${title}"`} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="contact-method">
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}

      <style jsx>{`
        .project-details {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .project-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 2rem;
        }

        /* Media Column */
        .media-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .media-gallery {
          position: sticky;
          top: 2rem;
        }

        .main-media {
          position: relative;
          aspect-ratio: 16/9;
          border-radius: 12px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .main-image:hover {
          transform: scale(1.02);
        }

        .video-container {
          width: 100%;
          height: 100%;
        }

        .main-video {
          width: 100%;
          height: 100%;
          border: none;
        }

        .media-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          background: #f9fafb;
          border-radius: 12px;
          color: #9ca3af;
        }

        .placeholder-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .featured-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .media-thumbnails {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .thumbnail {
          flex-shrink: 0;
          width: 80px;
          height: 60px;
          border-radius: 6px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          transition: border-color 0.2s ease;
          background: #f3f4f6;
        }

        .thumbnail.active {
          border-color: #2563eb;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-thumbnail {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #374151;
          color: white;
          font-size: 0.75rem;
        }

        .play-icon {
          margin-bottom: 0.25rem;
        }

        /* Info Column */
        .info-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .project-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .title-section {
          flex: 1;
        }

        .project-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }

        .project-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
        }

        .business-name {
          font-weight: 600;
          color: #374151;
          font-size: 1.125rem;
        }

        .location {
          color: #6b7280;
        }

        .category-tag {
          background: #eff6ff;
          color: #2563eb;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Funding Section */
        .funding-section {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .funding-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .remaining-funding {
          text-align: center;
          margin: 0;
          color: #374151;
        }

        .remaining-funding strong {
          color: #059669;
        }

        /* Action Buttons */
        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        /* Description Section */
        .description-section h3,
        .description-section h4 {
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .description-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .description-section h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.5rem;
        }

        .description,
        .description-content p {
          color: #374151;
          line-height: 1.6;
          margin: 0 0 1rem 0;
        }

        .description-content p:last-child {
          margin-bottom: 0;
        }

        /* Tags Section */
        .tags-section h4 {
          color: #1f2937;
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: #e5e7eb;
          color: #374151;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.875rem;
        }

        /* Seller Section */
        .seller-section h3 {
          color: #1f2937;
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .seller-card {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .seller-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .seller-avatar,
        .seller-avatar-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .seller-avatar-placeholder {
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #6b7280;
          font-size: 1.5rem;
        }

        .seller-info h4 {
          color: #1f2937;
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .seller-title {
          color: #6b7280;
          margin: 0.25rem 0 0 0;
          font-size: 0.875rem;
        }

        .seller-bio p {
          color: #374151;
          line-height: 1.5;
          margin: 0;
        }

        .seller-stats {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .seller-stats .stat {
          display: flex;
          justify-content: space-between;
          text-align: left;
        }

        .seller-stats .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .seller-stats .stat-value {
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Milestones Section */
        .milestones-section h3 {
          color: #1f2937;
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .milestones {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .milestone {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 4px solid #e5e7eb;
        }

        .milestone.completed {
          border-left-color: #10b981;
          background: #ecfdf5;
        }

        .milestone-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .milestone-content h4 {
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .milestone-content p {
          color: #6b7280;
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .milestone-date {
          color: #9ca3af;
          font-size: 0.75rem;
        }

        /* Modal Styles */
        .image-modal {
          display: flex;
          justify-content: center;
          align-items: center;
          max-height: 80vh;
        }

        .modal-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }

        .contact-modal {
          text-align: center;
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .contact-method {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #f3f4f6;
          border-radius: 8px;
          text-decoration: none;
          color: #374151;
          font-weight: 500;
          transition: background 0.2s ease;
        }

        .contact-method:hover {
          background: #e5e7eb;
        }

        /* Mobile adjustments */
        @media (max-width: 1024px) {
          .project-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .media-gallery {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .project-content {
            padding: 1rem;
          }

          .project-title {
            font-size: 1.5rem;
          }

          .project-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          .funding-stats {
            grid-template-columns: 1fr;
            text-align: left;
          }

          .stat {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .project-header {
            flex-direction: column;
            align-items: stretch;
          }

          .owner-actions {
            align-self: flex-end;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .project-details {
            background: #1f2937;
            color: #f3f4f6;
          }

          .project-title,
          .description-section h3,
          .description-section h4,
          .seller-section h3,
          .milestones-section h3 {
            color: #f3f4f6;
          }

          .business-name {
            color: #e5e7eb;
          }

          .funding-section,
          .seller-card {
            background: #374151;
            border-color: #4b5563;
          }

          .stat-value {
            color: #f3f4f6;
          }

          .category-tag {
            background: #1e3a8a;
            color: #93c5fd;
          }

          .milestone {
            background: #374151;
          }

          .milestone.completed {
            background: #064e3b;
          }

          .contact-method {
            background: #4b5563;
            color: #e5e7eb;
          }

          .contact-method:hover {
            background: #6b7280;
          }
        }

        /* Print styles */
        @media print {
          .action-buttons,
          .owner-actions {
            display: none;
          }

          .project-content {
            grid-template-columns: 1fr;
          }

          .media-gallery {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
