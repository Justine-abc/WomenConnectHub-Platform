// WomenConnect Hub - User Profile Component
// Profile management and display

import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateAndConvertGoogleDriveLink } from '../../utils/linkUtils';
import { formatCurrency, timeAgo } from '../../utils/helpers';

const UserProfile = ({ 
  userId, 
  isOwnProfile = false, 
  onEdit, 
  onContact,
  className = '' 
}) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Replace with actual API calls
      const userData = await mockFetchUser(userId);
      const projectsData = await mockFetchUserProjects(userId);
      
      setUser(userData);
      setProjects(projectsData);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock API calls - replace with actual implementation
  const mockFetchUser = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id,
      name: 'Amara Okafor',
      email: 'amara@example.com',
      userType: 'seller',
      avatar: 'https://drive.google.com/file/d/example/view',
      businessName: 'Amara Crafts & Textiles',
      location: 'Lagos, Nigeria',
      category: 'Crafts & Handmade',
      joinedDate: '2024-01-15',
      description: 'Passionate entrepreneur creating beautiful traditional African textiles and crafts. Committed to preserving cultural heritage while building sustainable business.',
      website: 'https://amaracrafts.com',
      socialMedia: {
        facebook: 'amaracrafts',
        instagram: 'amaracrafts',
        twitter: 'amaracrafts'
      },
      stats: {
        projectsCreated: 5,
        totalFunding: 15000,
        successfulProjects: 3,
        followers: 127
      },
      verified: true,
      lastActive: '2024-07-20'
    };
  };

  const mockFetchUserProjects = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        title: 'Traditional Kente Cloth Collection',
        status: 'active',
        fundingGoal: 10000,
        fundingRaised: 7500,
        images: ['https://drive.google.com/file/d/example1/view'],
        createdAt: '2024-06-15'
      },
      {
        id: 2,
        title: 'Eco-Friendly Handbag Line',
        status: 'completed',
        fundingGoal: 5000,
        fundingRaised: 5200,
        images: ['https://drive.google.com/file/d/example2/view'],
        createdAt: '2024-05-10'
      }
    ];
  };

  const renderProfileHeader = () => (
    <Card className="profile-header">
      <div className="profile-header-content">
        <div className="avatar-section">
          <div className="avatar-container">
            {user.avatar ? (
              <img
                src={validateAndConvertGoogleDriveLink(user.avatar)}
                alt={`${user.name}'s profile`}
                className="avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="avatar-placeholder" style={{ display: user.avatar ? 'none' : 'flex' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            {user.verified && (
              <div className="verified-badge" title="Verified Account">
                ✓
              </div>
            )}
          </div>
          
          {isOwnProfile && (
            <Button
              variant="secondary"
              size="small"
              onClick={onEdit}
              className="edit-avatar-btn"
            >
              Edit Photo
            </Button>
          )}
        </div>

        <div className="profile-info">
          <div className="name-section">
            <h1 className="user-name">{user.name}</h1>
            {user.businessName && (
              <p className="business-name">{user.businessName}</p>
            )}
            <div className="user-meta">
              <span className="user-type">{user.userType === 'seller' ? 'Entrepreneur' : 'Investor'}</span>
              <span className="location">{user.location}</span>
              {user.category && <span className="category">{user.category}</span>}
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{user.stats.projectsCreated}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat">
              <span className="stat-value">{formatCurrency(user.stats.totalFunding)}</span>
              <span className="stat-label">Total Funding</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.stats.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>

          <div className="profile-actions">
            {isOwnProfile ? (
              <Button variant="primary" onClick={onEdit}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  variant="primary" 
                  onClick={() => setShowContactModal(true)}
                >
                  Contact
                </Button>
                <Button variant="secondary">
                  Follow
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderNavTabs = () => (
    <div className="profile-tabs">
      <button
        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => setActiveTab('overview')}
      >
        Overview
      </button>
      <button
        className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
        onClick={() => setActiveTab('projects')}
      >
        Projects ({projects.length})
      </button>
      {user.userType === 'seller' && (
        <button
          className={`tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      )}
    </div>
  );

  const renderOverviewTab = () => (
    <div className="tab-content">
      <div className="overview-grid">
        <Card className="about-section">
          <h3>About</h3>
          <p>{user.description}</p>
          
          {user.website && (
            <div className="contact-info">
              <h4>Website</h4>
              <a 
                href={user.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="website-link"
              >
                {user.website}
              </a>
            </div>
          )}

          <div className="social-links">
            <h4>Connect</h4>
            <div className="social-buttons">
              {user.socialMedia.facebook && (
                <a 
                  href={`https://facebook.com/${user.socialMedia.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn facebook"
                >
                  Facebook
                </a>
              )}
              {user.socialMedia.instagram && (
                <a 
                  href={`https://instagram.com/${user.socialMedia.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn instagram"
                >
                  Instagram
                </a>
              )}
              {user.socialMedia.twitter && (
                <a 
                  href={`https://twitter.com/${user.socialMedia.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn twitter"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        </Card>

        <Card className="activity-section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">🚀</span>
              <div>
                <p>Launched new project "Traditional Kente Cloth Collection"</p>
                <span className="activity-time">{timeAgo('2024-06-15')}</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <div>
                <p>Successfully completed "Eco-Friendly Handbag Line"</p>
                <span className="activity-time">{timeAgo('2024-05-20')}</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">👥</span>
              <div>
                <p>Joined WomenConnect Hub</p>
                <span className="activity-time">{timeAgo(user.joinedDate)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="tab-content">
      <div className="projects-grid">
        {projects.map(project => (
          <Card key={project.id} className="project-card">
            <div className="project-image">
              {project.images[0] ? (
                <img
                  src={validateAndConvertGoogleDriveLink(project.images[0])}
                  alt={project.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="project-image-placeholder" style={{ display: project.images[0] ? 'none' : 'flex' }}>
                🏢
              </div>
              <div className={`project-status ${project.status}`}>
                {project.status}
              </div>
            </div>
            <div className="project-info">
              <h4>{project.title}</h4>
              <div className="funding-progress">
                <div className="funding-bar">
                  <div 
                    className="funding-fill"
                    style={{ width: `${(project.fundingRaised / project.fundingGoal) * 100}%` }}
                  />
                </div>
                <div className="funding-text">
                  {formatCurrency(project.fundingRaised)} of {formatCurrency(project.fundingGoal)}
                </div>
              </div>
              <p className="project-date">Created {timeAgo(project.createdAt)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="profile-loading">
        <LoadingSpinner size="large" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="profile-error">
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
        <Button onClick={fetchUserProfile}>Try Again</Button>
      </Card>
    );
  }

  return (
    <div className={`user-profile ${className}`}>
      {renderProfileHeader()}
      {renderNavTabs()}
      
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'projects' && renderProjectsTab()}
      
      {showContactModal && (
        <Modal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          title={`Contact ${user.name}`}
        >
          <p>Contact modal content here...</p>
        </Modal>
      )}

      <style jsx>{`
        .user-profile {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }

        .profile-header-content {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .avatar-container {
          position: relative;
        }

        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #e5e7eb;
        }

        .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: bold;
          color: white;
          border: 4px solid #e5e7eb;
        }

        .verified-badge {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 32px;
          height: 32px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
          border: 3px solid white;
        }

        .profile-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .user-name {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .business-name {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
        }

        .user-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .user-meta span {
          position: relative;
        }

        .user-meta span:not(:last-child):after {
          content: '•';
          margin-left: 1rem;
          color: #d1d5db;
        }

        .profile-stats {
          display: flex;
          gap: 2rem;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-label {
          display: block;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
        }

        .profile-tabs {
          display: flex;
          border-bottom: 2px solid #e5e7eb;
          margin: 2rem 0 1rem 0;
          gap: 0;
        }

        .tab {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
        }

        .tab:hover {
          color: #374151;
          background: #f9fafb;
        }

        .tab.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
        }

        .tab-content {
          padding: 1.5rem 0;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .about-section h3,
        .activity-section h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .about-section p {
          line-height: 1.6;
          color: #374151;
          margin-bottom: 1.5rem;
        }

        .contact-info h4,
        .social-links h4 {
          margin: 1.5rem 0 0.5rem 0;
          color: #374151;
          font-size: 1rem;
        }

        .website-link {
          color: #2563eb;
          text-decoration: none;
        }

        .website-link:hover {
          text-decoration: underline;
        }

        .social-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .social-btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .social-btn.facebook {
          background: #1877f2;
          color: white;
        }

        .social-btn.instagram {
          background: #e4405f;
          color: white;
        }

        .social-btn.twitter {
          background: #1da1f2;
          color: white;
        }

        .social-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .activity-icon {
          font-size: 1.25rem;
          width: 2rem;
          text-align: center;
          flex-shrink: 0;
        }

        .activity-item p {
          margin: 0 0 0.25rem 0;
          color: #374151;
          font-size: 0.875rem;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .project-card {
          overflow: hidden;
        }

        .project-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .project-image-placeholder {
          width: 100%;
          height: 100%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: #9ca3af;
        }

        .project-status {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .project-status.active {
          background: #dcfce7;
          color: #166534;
        }

        .project-status.completed {
          background: #dbeafe;
          color: #1e40af;
        }

        .project-status.paused {
          background: #fef3c7;
          color: #92400e;
        }

        .project-info {
          padding: 1rem;
        }

        .project-info h4 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .funding-progress {
          margin-bottom: 0.75rem;
        }

        .funding-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .funding-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .funding-text {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 600;
        }

        .project-date {
          font-size: 0.75rem;
          color: #9ca3af;
          margin: 0;
        }

        .profile-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .profile-loading p {
          margin-top: 1rem;
          color: #6b7280;
        }

        .profile-error {
          text-align: center;
          padding: 3rem 2rem;
        }

        .profile-error h2 {
          margin: 0 0 1rem 0;
          color: #dc2626;
        }

        .profile-error p {
          margin: 0 0 2rem 0;
          color: #6b7280;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .user-profile {
            padding: 0.5rem;
          }

          .profile-header-content {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }

          .profile-info {
            align-items: center;
          }

          .profile-stats {
            justify-content: center;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .profile-actions {
            flex-direction: column;
            width: 100%;
          }

          .user-name {
            font-size: 1.5rem;
          }

          .avatar,
          .avatar-placeholder {
            width: 100px;
            height: 100px;
          }

          .avatar-placeholder {
            font-size: 2.5rem;
          }

          .profile-tabs {
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .tab {
            white-space: nowrap;
            padding: 1rem;
          }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .user-name,
          .about-section h3,
          .activity-section h3,
          .contact-info h4,
          .social-links h4,
          .project-info h4,
          .stat-value {
            color: #f3f4f6;
          }

          .business-name,
          .activity-item p,
          .funding-text {
            color: #d1d5db;
          }

          .user-meta,
          .stat-label,
          .about-section p {
            color: #9ca3af;
          }

          .tab {
            color: #9ca3af;
          }

          .tab:hover {
            color: #d1d5db;
            background: #374151;
          }

          .tab.active {
            color: #60a5fa;
          }

          .project-image-placeholder {
            background: #374151;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .avatar,
          .avatar-placeholder {
            border-width: 6px;
          }

          .tab.active {
            border-bottom-width: 4px;
          }

          .social-btn {
            border: 2px solid currentColor;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;