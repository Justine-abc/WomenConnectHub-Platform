// WomenConnect Hub - General User Dashboard
// Central hub for user activities and navigation

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency, timeAgo } from '../../utils/helpers';

const UserDashboard = ({ className = '' }) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNotifications, setActiveNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Replace with actual API calls
      const data = await mockFetchDashboardData();
      setDashboardData(data);
      setActiveNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock API call - replace with actual implementation
  const mockFetchDashboardData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user?.userType === 'seller') {
      return {
        stats: {
          totalProjects: 3,
          activeProjects: 1,
          totalFunding: 12500,
          pendingApprovals: 0,
          totalViews: 284,
          totalContacts: 15
        },
        recentProjects: [
          {
            id: 1,
            title: 'Traditional Kente Cloth Collection',
            status: 'active',
            fundingRaised: 7500,
            fundingGoal: 10000,
            views: 127,
            contacts: 8,
            createdAt: '2024-06-15'
          }
        ],
        recentActivity: [
          {
            type: 'contact',
            message: 'New inquiry from Sarah Johnson about your Kente project',
            time: '2 hours ago'
          },
          {
            type: 'view',
            message: 'Your project was viewed 15 times today',
            time: '5 hours ago'
          }
        ],
        notifications: [
          {
            id: 1,
            type: 'success',
            title: 'Project Approved!',
            message: 'Your "Traditional Kente Cloth Collection" has been approved and is now live.',
            time: '1 day ago',
            read: false
          }
        ]
      };
    } else {
      return {
        stats: {
          projectsViewed: 45,
          projectsBookmarked: 8,
          contactsSent: 5,
          investmentsMade: 2,
          totalInvested: 5000,
          followingCount: 12
        },
        recentActivity: [
          {
            type: 'contact',
            message: 'You contacted Amara Okafor about her textile project',
            time: '3 hours ago'
          },
          {
            type: 'bookmark',
            message: 'You bookmarked "Eco-Friendly Soap Making"',
            time: '1 day ago'
          }
        ],
        recommendedProjects: [
          {
            id: 2,
            title: 'Organic Farm Expansion',
            businessName: 'Green Valley Farms',
            location: 'Kenya',
            fundingGoal: 15000,
            fundingRaised: 8500,
            category: 'Agriculture'
          }
        ],
        notifications: [
          {
            id: 2,
            type: 'info',
            title: 'New Project Match',
            message: 'We found a new agriculture project that matches your interests.',
            time: '2 hours ago',
            read: false
          }
        ]
      };
    }
  };

  const dismissNotification = (notificationId) => {
    setActiveNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const renderSellerDashboard = () => (
    <div className="dashboard-content">
      {/* Quick Stats */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-value">{dashboardData.stats.totalProjects}</span>
            <span className="stat-label">Total Projects</span>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-info">
            <span className="stat-value">{dashboardData.stats.activeProjects}</span>
            <span className="stat-label">Active Projects</span>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">{formatCurrency(dashboardData.stats.totalFunding)}</span>
            <span className="stat-label">Total Funding</span>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-icon">👀</div>
          <div className="stat-info">
            <span className="stat-value">{dashboardData.stats.totalViews}</span>
            <span className="stat-label">Total Views</span>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Button variant="primary" className="action-btn">
            <span className="btn-icon">➕</span>
            Create New Project
          </Button>
          <Button variant="secondary" className="action-btn">
            <span className="btn-icon">📊</span>
            View Analytics
          </Button>
          <Button variant="secondary" className="action-btn">
            <span className="btn-icon">✏️</span>
            Edit Profile
          </Button>
          <Button variant="secondary" className="action-btn">
            <span className="btn-icon">💬</span>
            Messages ({dashboardData.stats.totalContacts})
          </Button>
        </div>
      </Card>

      {/* Recent Projects */}
      <Card className="recent-projects">
        <div className="section-header">
          <h3>Your Projects</h3>
          <Button variant="text" size="small">View All</Button>
        </div>
        <div className="projects-list">
          {dashboardData.recentProjects.map(project => (
            <div key={project.id} className="project-item">
              <div className="project-info">
                <h4>{project.title}</h4>
                <span className={`project-status ${project.status}`}>
                  {project.status}
                </span>
              </div>
              <div className="project-stats">
                <div className="funding-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(project.fundingRaised / project.fundingGoal) * 100}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {formatCurrency(project.fundingRaised)} / {formatCurrency(project.fundingGoal)}
                  </span>
                </div>
                <div className="project-metrics">
                  <span>{project.views} views</span>
                  <span>{project.contacts} contacts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderInvestorDashboard = () => (
    <div className="dashboard-content">
      {/* Quick Stats */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">👀</div>
          <div className="stat-info">
            <span className="stat-value">{dashboardData.stats.projectsViewed}</span>
            <span className="stat-label">Projects Viewed</span>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-icon">🔖</div>
          <div className="stat-info">
            <span className="stat-value">{dashboardData.stats.projectsBookmarked}</span>
            <span className="stat-label">Bookmarked</span>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">{formatCurrency(dashboardData.stats.totalInvested)}</span>
            <span className="stat-label">Total Invested</span>
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{dashboardData.stats.followingCount}</span>
            <span className="stat-label">Following</span>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Button variant="primary" className="action-btn">
            <span className="btn-icon">🔍</span>
            Browse Projects
          </Button>
          <Button variant="secondary" className="action-btn">
            <span className="btn-icon">🔖</span>
            My Bookmarks
          </Button>
          <Button variant="secondary" className="action-btn">
            <span className="btn-icon">📊</span>
            Investment Portfolio
          </Button>
          <Button variant="secondary" className="action-btn">
            <span className="btn-icon">💬</span>
            Messages
          </Button>
        </div>
      </Card>

      {/* Recommended Projects */}
      <Card className="recommended-projects">
        <div className="section-header">
          <h3>Recommended for You</h3>
          <Button variant="text" size="small">View All</Button>
        </div>
        <div className="projects-list">
          {dashboardData.recommendedProjects.map(project => (
            <div key={project.id} className="project-item">
              <div className="project-info">
                <h4>{project.title}</h4>
                <p className="project-business">{project.businessName}</p>
                <div className="project-meta">
                  <span>{project.category}</span>
                  <span>{project.location}</span>
                </div>
              </div>
              <div className="project-funding">
                <div className="funding-amount">
                  {formatCurrency(project.fundingRaised)} raised
                </div>
                <div className="funding-goal">
                  Goal: {formatCurrency(project.fundingGoal)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    activeNotifications.length > 0 && (
      <div className="notifications-section">
        {activeNotifications.map(notification => (
          <Card key={notification.id} className={`notification ${notification.type}`}>
            <div className="notification-content">
              <div className="notification-header">
                <h4>{notification.title}</h4>
                <button 
                  className="dismiss-btn"
                  onClick={() => dismissNotification(notification.id)}
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </div>
              <p>{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </Card>
        ))}
      </div>
    )
  );

  const renderRecentActivity = () => (
    <Card className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {dashboardData.recentActivity.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className={`activity-icon ${activity.type}`}>
              {activity.type === 'contact' ? '💬' : 
               activity.type === 'view' ? '👀' : 
               activity.type === 'bookmark' ? '🔖' : '📊'}
            </div>
            <div className="activity-content">
              <p>{activity.message}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="large" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`user-dashboard ${className}`}>
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}!</h1>
          <p className="welcome-subtitle">
            {user?.userType === 'seller' 
              ? 'Manage your projects and connect with investors'
              : 'Discover amazing projects and connect with entrepreneurs'
            }
          </p>
        </div>
      </div>

      {renderNotifications()}

      <div className="dashboard-layout">
        <div className="main-content">
          {user?.userType === 'seller' 
            ? renderSellerDashboard() 
            : renderInvestorDashboard()
          }
        </div>
        
        <div className="sidebar-content">
          {renderRecentActivity()}
        </div>
      </div>

      <style jsx>{`
        .user-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .welcome-section h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .welcome-subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 1.125rem;
        }

        .notifications-section {
          margin-bottom: 2rem;
        }

        .notification {
          margin-bottom: 1rem;
          border-left: 4px solid;
        }

        .notification.success {
          border-left-color: #10b981;
          background: #ecfdf5;
        }

        .notification.info {
          border-left-color: #3b82f6;
          background: #eff6ff;
        }

        .notification.warning {
          border-left-color: #f59e0b;
          background: #fffbeb;
        }

        .notification-content {
          padding: 1rem;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .notification-header h4 {
          margin: 0;
          color: #1f2937;
          font-size: 1rem;
        }

        .dismiss-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dismiss-btn:hover {
          color: #6b7280;
        }

        .notification p {
          margin: 0 0 0.5rem 0;
          color: #374151;
          font-size: 0.875rem;
        }

        .notification-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .dashboard-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
        }

        .main-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
        }

        .stat-icon {
          font-size: 2rem;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 12px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .quick-actions {
          padding: 1.5rem;
        }

        .quick-actions h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
        }

        .btn-icon {
          font-size: 1.125rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header h3 {
          margin: 0;
          color: #1f2937;
        }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .project-item {
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .project-item:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .project-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .project-info h4 {
          margin: 0;
          color: #1f2937;
          font-size: 1rem;
        }

        .project-business {
          margin: 0.25rem 0 0 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .project-meta {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .project-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
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

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 600;
        }

        .project-metrics {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: 0.5rem;
        }

        .project-funding {
          text-align: right;
        }

        .funding-amount {
          font-weight: 600;
          color: #059669;
          margin-bottom: 0.25rem;
        }

        .funding-goal {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .recent-activity {
          padding: 1.5rem;
        }

        .recent-activity h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .activity-icon {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .activity-icon.contact {
          background: #dbeafe;
        }

        .activity-icon.view {
          background: #f3e8ff;
        }

        .activity-icon.bookmark {
          background: #fef3c7;
        }

        .activity-content p {
          margin: 0 0 0.25rem 0;
          color: #374151;
          font-size: 0.875rem;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }

        .dashboard-loading p {
          margin-top: 1rem;
          color: #6b7280;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .user-dashboard {
            padding: 0.5rem;
          }

          .dashboard-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          .welcome-section h1 {
            font-size: 1.5rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .project-info {
            flex-direction: column;
            gap: 0.5rem;
          }

          .project-meta {
            flex-direction: column;
            gap: 0.25rem;
          }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .welcome-section h1,
          .quick-actions h3,
          .section-header h3,
          .recent-activity h3,
          .notification-header h4,
          .project-info h4,
          .stat-value {
            color: #f3f4f6;
          }

          .welcome-subtitle,
          .stat-label,
          .project-business,
          .progress-text,
          .funding-goal,
          .activity-content p,
          .notification p {
            color: #d1d5db;
          }

          .project-meta,
          .project-metrics,
          .activity-time,
          .notification-time {
            color: #9ca3af;
          }

          .stat-icon {
            background: #374151;
          }

          .project-item {
            border-color: #4b5563;
            background: #1f2937;
          }

          .project-item:hover {
            border-color: #6b7280;
          }

          .notification.success {
            background: #064e3b;
          }

          .notification.info {
            background: #1e3a8a;
          }

          .notification.warning {
            background: #92400e;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;