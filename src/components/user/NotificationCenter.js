// WomenConnect Hub - Notification Center Component
// User notifications management

import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { timeAgo } from '../../utils/helpers';

const NotificationCenter = ({ 
  notifications = [], 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDeleteNotification,
  loading = false 
}) => {
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const notificationTypes = {
    project_update: { icon: '📝', color: '#2563eb', label: 'Project Update' },
    investment: { icon: '💰', color: '#059669', label: 'Investment' },
    message: { icon: '💬', color: '#7c3aed', label: 'Message' },
    system: { icon: '⚙️', color: '#6b7280', label: 'System' },
    reminder: { icon: '⏰', color: '#f59e0b', label: 'Reminder' },
    achievement: { icon: '🏆', color: '#dc2626', label: 'Achievement' }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedNotifications.length === 0) return;

    try {
      for (const notificationId of selectedNotifications) {
        if (action === 'read') {
          await onMarkAsRead(notificationId);
        } else if (action === 'delete') {
          await onDeleteNotification(notificationId);
        }
      }
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const renderNotificationItem = (notification) => {
    const type = notificationTypes[notification.type] || notificationTypes.system;
    
    return (
      <div
        key={notification.id}
        className={`notification-item ${!notification.read ? 'unread' : ''}`}
        onClick={() => !notification.read && onMarkAsRead(notification.id)}
      >
        <div className="notification-select">
          <input
            type="checkbox"
            checked={selectedNotifications.includes(notification.id)}
            onChange={() => handleSelectNotification(notification.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="notification-icon" style={{ color: type.color }}>
          {type.icon}
        </div>

        <div className="notification-content">
          <div className="notification-header">
            <h4 className="notification-title">{notification.title}</h4>
            <span className="notification-time">{timeAgo(notification.createdAt)}</span>
          </div>
          
          <p className="notification-message">{notification.message}</p>
          
          {notification.actionUrl && (
            <div className="notification-actions">
              <Button
                size="small"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(notification.actionUrl, '_blank');
                }}
              >
                {notification.actionText || 'View'}
              </Button>
            </div>
          )}

          <div className="notification-meta">
            <span className="notification-type">{type.label}</span>
            {!notification.read && <span className="unread-indicator">●</span>}
          </div>
        </div>

        <div className="notification-controls">
          {!notification.read && (
            <button
              className="mark-read-btn"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              title="Mark as read"
            >
              ✓
            </button>
          )}
          
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNotification(notification.id);
            }}
            title="Delete notification"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="empty-state">
      <div className="empty-icon">🔔</div>
      <h3>No notifications</h3>
      <p>
        {filter === 'unread' 
          ? "You're all caught up! No unread notifications."
          : "You don't have any notifications yet."}
      </p>
    </div>
  );

  return (
    <div className="notification-center">
      <div className="notification-header">
        <div className="header-left">
          <h2>Notifications</h2>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} unread</span>
          )}
        </div>
        
        <div className="header-actions">
          {unreadCount > 0 && (
            <Button
              size="small"
              variant="secondary"
              onClick={onMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="notification-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          {Object.entries(notificationTypes).map(([type, config]) => {
            const count = notifications.filter(n => n.type === type).length;
            if (count === 0) return null;
            
            return (
              <button
                key={type}
                className={`filter-tab ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {config.icon} {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {selectedNotifications.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-info">
            <label className="select-all">
              <input
                type="checkbox"
                checked={selectedNotifications.length === filteredNotifications.length}
                onChange={handleSelectAll}
              />
              {selectedNotifications.length} selected
            </label>
          </div>
          
          <div className="bulk-buttons">
            <Button
              size="small"
              variant="secondary"
              onClick={() => handleBulkAction('read')}
            >
              Mark as read
            </Button>
            <Button
              size="small"
              variant="danger"
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="notification-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">⏳</div>
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map(renderNotificationItem)
        ) : (
          renderEmptyState()
        )}
      </div>

      <style jsx>{`
        .notification-center {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .notification-header h2 {
          margin: 0;
          color: #1f2937;
        }

        .unread-badge {
          background: #dc2626;
          color: #ffffff;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .notification-filters {
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 1rem;
        }

        .filter-tab {
          padding: 0.5rem 1rem;
          background: none;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .filter-tab:hover {
          border-color: #2563eb;
          color: #2563eb;
        }

        .filter-tab.active {
          background: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
        }

        .bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f3f4f6;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .select-all {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          color: #374151;
        }

        .bulk-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .notification-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: #ffffff;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .notification-item:hover {
          border-color: #2563eb;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .notification-item.unread {
          border-color: #2563eb;
          background: #f0f9ff;
        }

        .notification-select {
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .notification-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .notification-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .notification-time {
          font-size: 0.875rem;
          color: #6b7280;
          white-space: nowrap;
        }

        .notification-message {
          margin: 0 0 1rem 0;
          color: #374151;
          line-height: 1.5;
        }

        .notification-actions {
          margin-bottom: 1rem;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .notification-type {
          font-size: 0.75rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .unread-indicator {
          color: #2563eb;
          font-size: 0.75rem;
        }

        .notification-controls {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .mark-read-btn,
        .delete-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
        }

        .mark-read-btn {
          background: #dcfce7;
          color: #166534;
        }

        .mark-read-btn:hover {
          background: #bbf7d0;
        }

        .delete-btn {
          background: #fef2f2;
          color: #dc2626;
        }

        .delete-btn:hover {
          background: #fecaca;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          color: #374151;
        }

        .empty-state p {
          margin: 0;
        }

        .loading-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .loading-spinner {
          font-size: 2rem;
          margin-bottom: 1rem;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .notification-center {
            padding: 1rem;
          }

          .notification-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .header-left {
            justify-content: center;
          }

          .header-actions {
            text-align: center;
          }

          .filter-tabs {
            justify-content: center;
          }

          .notification-item {
            padding: 1rem;
            gap: 0.75rem;
          }

          .notification-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .notification-time {
            align-self: flex-start;
          }

          .notification-controls {
            flex-direction: row;
          }

          .bulk-actions {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .notification-center {
            color: #f3f4f6;
          }

          .notification-header h2 {
            color: #f3f4f6;
          }

          .notification-item {
            background: #374151;
            border-color: #4b5563;
          }

          .notification-item.unread {
            background: #1e3a8a;
            border-color: #2563eb;
          }

          .notification-title {
            color: #f3f4f6;
          }

          .notification-message {
            color: #d1d5db;
          }

          .notification-type {
            background: #4b5563;
            color: #d1d5db;
          }

          .bulk-actions {
            background: #4b5563;
          }

          .select-all {
            color: #d1d5db;
          }

          .empty-state h3 {
            color: #f3f4f6;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .notification-item {
            border-width: 3px;
          }

          .filter-tab {
            border-width: 3px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationCenter;