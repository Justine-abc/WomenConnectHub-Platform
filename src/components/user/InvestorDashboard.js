// WomenConnect Hub - Investor Dashboard Component
// Dashboard for investors and sponsors to track interests and opportunities

import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import ProjectCard from '../projects/ProjectCard';
import ProjectFilters from '../projects/ProjectFilters';
import { formatCurrency, timeAgo } from '../../utils/helpers';

const InvestorDashboard = ({ user, onNavigate }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [stats, setStats] = useState({
    watchlistCount: 0,
    totalInvestments: 0,
    averageInvestment: 0,
    successfulInvestments: 0,
    newOpportunities: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

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
        watchlistCount: 12,
        totalInvestments: 75000,
        averageInvestment: 8500,
        successfulInvestments: 8,
        newOpportunities: 25
      });

      setWatchlist([
        {
          id: 1,
          title: "Sustainable Fashion Startup",
          businessName: "EcoWear Africa",
          category: "Fashion & Textiles",
          location: "Nigeria",
          fundingGoal: 15000,
          fundingRaised: 8500,
          sellerName: "Amina Hassan",
          images: ["https://example.com/fashion.jpg"],
          addedToWatchlist: "2024-01-18"
        },
        {
          id: 2,
          title: "Tech Education Platform",
          businessName: "CodeHer Kenya",
          category: "Education & Technology",
          location: "Kenya",
          fundingGoal: 25000,
          fundingRaised: 12000,
          sellerName: "Grace Wanjiku",
          images: ["https://example.com/tech.jpg"],
          addedToWatchlist: "2024-01-20"
        }
      ]);

      setRecentProjects([
        {
          id: 3,
          title: "Organic Farming Initiative",
          businessName: "Green Fields",
          category: "Agriculture",
          location: "Ghana",
          fundingGoal: 8000,
          fundingRaised: 2500,
          sellerName: "Akosua Mensah",
          images: ["https://example.com/farming.jpg"]
        }
      ]);

      setNotifications([
        { 
          type: 'watchlist', 
          message: 'EcoWear Africa reached 60% of funding goal', 
          time: '2 hours ago',
          actionRequired: false
        },
        { 
          type: 'opportunity', 
          message: '5 new projects match your investment criteria', 
          time: '1 day ago',
          actionRequired: true
        },
        { 
          type: 'investment', 
          message: 'Your investment in GreenTech Solutions was successful', 
          time: '3 days ago',
          actionRequired: false
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatsCards = () => (
    <div className="stats-grid">
      <Card className="stat-card primary">
        <div className="stat-content">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{stats.watchlistCount}</h3>
            <p>Projects in Watchlist</p>
          </div>
        </div>
      </Card>

      <Card className="stat-card success">
        <div className="stat-content">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalInvestments)}</h3>
            <p>Total Investments</p>
          </div>
        </div>
      </Card>

      <Card className="stat-card info">
        <div className="stat-content">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.averageInvestment)}</h3>
            <p>Average Investment</p>
          </div>
        </div>
      </Card>

      <Card className="stat-card success">
        <div className="stat-content">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.successfulInvestments}</h3>
            <p>Successful Investments</p>
          </div>
        </div>
      </Card>

      <Card className="stat-card warning">
        <div className="stat-content">
          <div className="stat-icon">🚀</div>
          <div className="stat-info">
            <h3>{stats.newOpportunities}</h3>
            <p>New Opportunities</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderInvestmentPreferences = () => (
    <Card className="investment-preferences">
      <h3>Your Investment Preferences</h3>
      <div className="preferences-grid">
        <div className="preference-item">
          <strong>Preferred Categories:</strong>
          <div className="tags">
            <span className="tag">Technology</span>
            <span className="tag">Agriculture</span>
            <span className="tag">Healthcare</span>
          </div>
        </div>
        <div className="preference-item">
          <strong>Investment Range:</strong>
          <p>{formatCurrency(user?.investmentRange?.min || 1000)} - {formatCurrency(user?.investmentRange?.max || 50000)}</p>
        </div>
        <div className="preference-item">
          <strong>Preferred Locations:</strong>
          <div className="tags">
            <span className="tag">Nigeria</span>
            <span className="tag">Kenya</span>
            <span className="tag">Ghana</span>
          </div>
        </div>
      </div>
      <Button 
        variant="secondary" 
        size="small"
        onClick={() => onNavigate('/profile/settings')}
      >
        Update Preferences
      </Button>
    </Card>
  );

  const renderNotifications = () => (
    <Card className="notifications-card">
      <h3>Recent Notifications</h3>
      <div className="notifications-list">
        {notifications.map((notification, index) => (
          <div key={index} className={`notification-item ${notification.type}`}>
            <div className="notification-icon">
              {notification.type === 'watchlist' && '⭐'}
              {notification.type === 'opportunity' && '🔍'}
              {notification.type === 'investment' && '💰'}
            </div>
            <div className="notification-content">
              <p>{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
            {notification.actionRequired && (
              <Button variant="primary" size="small">
                View
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button variant="link" size="small">
        View All Notifications
      </Button>
    </Card>
  );

  const renderWatchlist = () => (
    <div className="watchlist-section">
      <div className="section-header">
        <h3>Your Watchlist</h3>
        <Button 
          variant="secondary"
          onClick={() => onNavigate('/projects')}
        >
          Browse Projects
        </Button>
      </div>
      
      {watchlist.length === 0 ? (
        <Card className="empty-state">
          <div className="empty-content">
            <div className="empty-icon">⭐</div>
            <h4>Your watchlist is empty</h4>
            <p>Start by exploring projects and adding interesting ones to your watchlist.</p>
            <Button 
              variant="primary"
              onClick={() => onNavigate('/projects')}
            >
              Explore Projects
            </Button>
          </div>
        </Card>
      ) : (
        <div className="projects-grid">
          {watchlist.map(project => (
            <div key={project.id} className="watchlist-item">
              <ProjectCard 
                project={project}
                onViewDetails={() => onNavigate(`/projects/${project.id}`)}
                onContact={() => {}}
                showActions={true}
              />
              <div className="watchlist-actions">
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={() => removeFromWatchlist(project.id)}
                >
                  Remove from Watchlist
                </Button>
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={() => onNavigate(`/projects/${project.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRecommendations = () => (
    <div className="recommendations-section">
      <div className="section-header">
        <h3>Recommended for You</h3>
        <Button 
          variant="link"
          onClick={() => onNavigate('/projects')}
        >
          See All
        </Button>
      </div>
      
      <div className="projects-grid">
        {recentProjects.map(project => (
          <ProjectCard 
            key={project.id}
            project={project}
            onViewDetails={() => onNavigate(`/projects/${project.id}`)}
            onContact={() => {}}
            showActions={true}
          />
        ))}
      </div>
    </div>
  );

  const removeFromWatchlist = (projectId) => {
    setWatchlist(prev => prev.filter(project => project.id !== projectId));
    setStats(prev => ({ ...prev, watchlistCount: prev.watchlistCount - 1 }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            {renderStatsCards()}
            <div className="dashboard-row">
              <div className="dashboard-left">
                {renderInvestmentPreferences()}
              </div>
              <div className="dashboard-right">
                {renderNotifications()}
              </div>
            </div>
            {renderRecommendations()}
          </div>
        );
      case 'watchlist':
        return renderWatchlist();
      case 'investments':
        return (
          <Card>
            <h3>Investment History</h3>
            <p>Investment tracking and history coming soon...</p>
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
        <p>Loading your investment dashboard...</p>
      </div>
    );
  }

  return (
    <div className="investor-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user?.name}! 🌟</h1>
          <p className="header-subtitle">
            Discover and invest in amazing African women entrepreneurs
          </p>
        </div>
        <div className="header-actions">
          <Button 
            variant="primary"
            onClick={() => onNavigate('/projects')}
          >
            Explore Projects
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
          className={`tab ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          Watchlist ({stats.watchlistCount})
        </button>
        <button 
          className={`tab ${activeTab === 'investments' ? 'active' : ''}`}
          onClick={() => setActiveTab('investments')}
        >
          My Investments
        </button>
      </div>

      <div className="dashboard-content">
        {renderTabContent()}
      </div>

      <style jsx>{`
        .investor-dashboard {
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
          margin-bottom: 2rem;
        }

        .investment-preferences {
          padding: 1.5rem;
        }

        .investment-preferences h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .preferences-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .preference-item strong {
          display: block;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .preference-item p {
          margin: 0;
          color: #6b7280;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          padding: 0.25rem 0.75rem;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .notifications-card {
          padding: 1.5rem;
        }

        .notifications-card h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .notification-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content p {
          margin: 0 0 0.25rem 0;
          color: #374151;
          font-size: 0.875rem;
        }

        .notification-time {
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h3 {
          margin: 0;
          color: #1f2937;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .watchlist-item {
          position: relative;
        }

        .watchlist-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .empty-state {
          padding: 3rem 1.5rem;
          text-align: center;
        }

        .empty-content {
          max-width: 400px;
          margin: 0 auto;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-content h4 {
          margin: 0 0 0.5rem 0;
          color: #374151;
        }

        .empty-content p {
          margin: 0 0 1.5rem 0;
          color: #6b7280;
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

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .preferences-grid {
            gap: 0.75rem;
          }

          .tags {
            gap: 0.25rem;
          }

          .tag {
            font-size: 0.625rem;
            padding: 0.25rem 0.5rem;
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

          .watchlist-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default InvestorDashboard;