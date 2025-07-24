// WomenConnect Hub - Seller Dashboard Component
// Entrepreneur dashboard for managing projects and tracking performance

import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import ProjectCard from '../projects/ProjectCard';
import { formatCurrency, timeAgo } from '../../utils/helpers';

const SellerDashboard = ({ user, onNavigate }) => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalFunding: 0,
    pendingApproval: 0,
    totalViews: 0,
    totalContacts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API calls - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        totalProjects: 8,
        activeProjects: 5,
        totalFunding: 25000,
        pendingApproval: 2,
        totalViews: 1250,
        totalContacts: 45
      });

      setProjects([
        {
          id: 1,
          title: "Eco-Friendly Fashion Line",
          status: "active",
          fundingGoal: 10000,
          fundingRaised: 7500,
          views: 320,
          contacts: 15,
          createdAt: "2024-01-15",
          images: ["https://example.com/fashion.jpg"]
        },
        {
          id: 2,
          title: "Organic Skincare Products",
          status: "pending",
          fundingGoal: 5000,
          fundingRaised: 0,
          views: 0,
          contacts: 0,
          createdAt: "2024-01-20",
          images: ["https://example.com/skincare.jpg"]
        }
      ]);

      setRecentActivity([
        { type: 'contact', message: 'New inquiry from John Smith', time: '2 hours ago' },
        { type: 'view', message: 'Your project was viewed 25 times today', time: '5 hours ago' },
        { type: 'approval', message: 'Project "Eco Fashion" approved', time: '1 day ago' }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatsCards = () => (
    <div className="stats-grid">
      <Card className="stat-card">
        <div className="stat-content">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.totalProjects}</h3>
            <p>Total Projects</p>
          </div>
        </div>
      </Card>

      <Card className="stat-card">
        <div className="stat-content">
          <div className="stat-icon">🚀</div>
          <div className="stat-info">
            <h3>{stats.activeProjects}</h3>
            <p>Active Projects</p>
          </div>
        </div>
      </Card>

      <Card className="stat-card success">
        <div className="stat-content">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalFunding)}</h3>
            <p>Total Funding</p>
          </div>
        </div>
      </Card>

      <Card className="stat-card warning">
        <div className="stat-content">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingApproval}</h3>
            <p>Pending Approval</p>
          </div>
        </div>
      </Card>

      <Card className="stat-card info">
        <div className="stat-content">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <h3>{stats.totalViews}</h3>
            <p>Total Views</p>
          </div>
        </div>
      </Card>

      <Card className="stat-card primary">
        <div className="stat-content">
          <div className="stat-icon">📞</div>
          <div className="stat-info">
            <h3>{stats.totalContacts}</h3>
            <p>Inquiries</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderQuickActions = () => (
    <Card className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="action-buttons">
        <Button 
          variant="primary" 
          onClick={() => onNavigate('/upload-project')}
          className="action-btn"
        >
          🚀 Create New Project
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => setActiveTab('projects')}
          className="action-btn"
        >
          📝 Manage Projects
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => onNavigate('/profile/settings')}
          className="action-btn"
        >
          ⚙️ Account Settings
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => onNavigate('/help')}
          className="action-btn"
        >
          💡 Get Help
        </Button>
      </div>
    </Card>
  );

  const renderRecentActivity = () => (
    <Card className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {recentActivity.map((activity, index) => (
          <div key={index} className={`activity-item ${activity.type}`}>
            <div className="activity-icon">
              {activity.type === 'contact' && '📧'}
              {activity.type === 'view' && '👁️'}
              {activity.type === 'approval' && '✅'}
            </div>
            <div className="activity-content">
              <p>{activity.message}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
      <Button variant="link" size="small">
        View All Activity
      </Button>
    </Card>
  );

  const renderProjectsManagement = () => (
    <div className="projects-management">
      <div className="projects-header">
        <h3>Your Projects</h3>
        <Button 
          variant="primary" 
          onClick={() => onNavigate('/upload-project')}
        >
          Add New Project
        </Button>
      </div>

      <div className="projects-filters">
        <select className="form-select">
          <option value="all">All Projects</option>
          <option value="active">Active</option>
          <option value="pending">Pending Approval</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="projects-list">
        {projects.map(project => (
          <div key={project.id} className="project-management-item">
            <ProjectCard 
              project={project} 
              layout="list"
              showActions={false}
            />
            <div className="project-actions">
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => onNavigate(`/projects/${project.id}/edit`)}
              >
                Edit
              </Button>
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => onNavigate(`/projects/${project.id}`)}
              >
                View
              </Button>
              {project.status === 'active' && (
                <Button variant="warning" size="small">
                  Pause
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            {renderStatsCards()}
            <div className="dashboard-row">
              <div className="dashboard-left">
                {renderQuickActions()}
              </div>
              <div className="dashboard-right">
                {renderRecentActivity()}
              </div>
            </div>
          </div>
        );
      case 'projects':
        return renderProjectsManagement();
      case 'analytics':
        return (
          <Card>
            <h3>Analytics & Insights</h3>
            <p>Detailed analytics coming soon...</p>
          </Card>
        );
      default:
        return renderStatsCards();
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="large" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p className="header-subtitle">
            Manage your projects and track your entrepreneurial journey
          </p>
        </div>
        <div className="header-actions">
          <Button 
            variant="primary"
            onClick={() => onNavigate('/upload-project')}
          >
            Create Project
          </Button>
        </div>
      </div>

      <div className="dashboard-tabs">
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
          My Projects
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="dashboard-content">
        {renderTabContent()}
      </div>

      <style jsx>{`
        .seller-dashboard {
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-content h1 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.875rem;
        }

        .header-subtitle {
          color: #6b7280;
          margin: 0;
        }

        .dashboard-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab {
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab:hover,
        .tab.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
        }

        .stat-card.success {
          border-left: 4px solid #10b981;
        }

        .stat-card.warning {
          border-left: 4px solid #f59e0b;
        }

        .stat-card.info {
          border-left: 4px solid #3b82f6;
        }

        .stat-card.primary {
          border-left: 4px solid #8b5cf6;
        }

        .stat-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .stat-info h3 {
          margin: 0;
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-info p {
          margin: 0.25rem 0 0 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .dashboard-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .quick-actions {
          padding: 1.5rem;
        }

        .quick-actions h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .action-btn {
          justify-content: flex-start;
          text-align: left;
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
          margin-bottom: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .activity-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .activity-content p {
          margin: 0 0 0.25rem 0;
          color: #374151;
          font-size: 0.875rem;
        }

        .activity-time {
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .projects-management {
          space-y: 1.5rem;
        }

        .projects-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .projects-header h3 {
          margin: 0;
          color: #1f2937;
        }

        .projects-filters {
          margin-bottom: 1.5rem;
        }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .project-management-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .project-management-item > :first-child {
          flex: 1;
        }

        .project-actions {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .dashboard-loading p {
          margin-top: 1rem;
          color: #6b7280;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
          }

          .header-actions {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-row {
            grid-template-columns: 1fr;
          }

          .projects-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .project-management-item {
            flex-direction: column;
            align-items: stretch;
          }

          .project-actions {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-tabs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .tab {
            white-space: nowrap;
            flex-shrink: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SellerDashboard;