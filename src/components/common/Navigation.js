// WomenConnect Hub - Navigation Component
// Mobile-friendly navigation menu

import React from 'react';
import { USER_ROLES, NAV_ITEMS } from '../../utils/constants.js';

const Navigation = ({ 
  user, 
  onLogout, 
  currentPath = '/', 
  isMobile = false,
  onLinkClick 
}) => {
  // Determine which navigation items to show based on user role
  const getNavItems = () => {
    if (!user) {
      return NAV_ITEMS.PUBLIC;
    }

    switch (user.role) {
      case USER_ROLES.SELLER:
        return NAV_ITEMS.SELLER;
      case USER_ROLES.INVESTOR:
        return NAV_ITEMS.INVESTOR;
      case USER_ROLES.ADMIN:
        return NAV_ITEMS.ADMIN;
      default:
        return NAV_ITEMS.PUBLIC;
    }
  };

  const navItems = getNavItems();

  const handleLinkClick = (href) => {
    if (onLinkClick) {
      onLinkClick();
    }
    // In a real app, you'd use React Router here
    // For now, we'll just handle the click
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    if (onLinkClick) {
      onLinkClick();
    }
  };

  const isActivePath = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const getIcon = (iconName) => {
    const icons = {
      home: '🏠',
      grid: '📋',
      info: 'ℹ️',
      mail: '✉️',
      dashboard: '📊',
      folder: '📁',
      plus: '➕',
      user: '👤',
      bookmark: '🔖',
      check: '✅',
      users: '👥',
      chart: '📈'
    };
    return icons[iconName] || '•';
  };

  return (
    <nav className={`navigation ${isMobile ? 'mobile-nav' : 'desktop-nav'}`} role="navigation">
      <ul className="nav-menu">
        {navItems.map((item, index) => (
          <li key={index} className="nav-item">
            <a
              href={item.path}
              className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
              onClick={() => handleLinkClick(item.path)}
              aria-current={isActivePath(item.path) ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                {getIcon(item.icon)}
              </span>
              <span className="nav-text">{item.label}</span>
            </a>
          </li>
        ))}

        {/* Authentication Section */}
        <li className="nav-divider" aria-hidden="true"></li>
        
        {user ? (
          <>
            {/* User Profile Link */}
            <li className="nav-item">
              <a
                href="/profile"
                className={`nav-link user-link ${isActivePath('/profile') ? 'active' : ''}`}
                onClick={() => handleLinkClick('/profile')}
                aria-current={isActivePath('/profile') ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">👤</span>
                <span className="nav-text">
                  {user.firstName || user.name || 'Profile'}
                </span>
              </a>
            </li>
            
            {/* Logout Button */}
            <li className="nav-item">
              <button
                className="nav-link logout-btn"
                onClick={handleLogout}
                type="button"
              >
                <span className="nav-icon" aria-hidden="true">🚪</span>
                <span className="nav-text">Logout</span>
              </button>
            </li>
          </>
        ) : (
          <>
            {/* Login Link */}
            <li className="nav-item">
              <a
                href="/login"
                className={`nav-link ${isActivePath('/login') ? 'active' : ''}`}
                onClick={() => handleLinkClick('/login')}
                aria-current={isActivePath('/login') ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">🔐</span>
                <span className="nav-text">Login</span>
              </a>
            </li>
            
            {/* Register Link */}
            <li className="nav-item">
              <a
                href="/register"
                className={`nav-link register-link ${isActivePath('/register') ? 'active' : ''}`}
                onClick={() => handleLinkClick('/register')}
                aria-current={isActivePath('/register') ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">✨</span>
                <span className="nav-text">Join Us</span>
              </a>
            </li>
          </>
        )}
      </ul>

      <style jsx>{`
        .navigation {
          width: 100%;
        }

        .nav-menu {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .nav-item {
          display: block;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          color: #4b5563;
          text-decoration: none;
          border-radius: var(--border-radius);
          transition: all 0.2s ease;
          min-height: var(--min-touch-target);
          font-weight: 500;
          border: none;
          background: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }

        .nav-link:hover,
        .nav-link:focus {
          color: #2563eb;
          background: #f3f4f6;
        }

        .nav-link.active {
          color: #2563eb;
          background: #dbeafe;
          font-weight: 600;
        }

        .nav-icon {
          font-size: var(--font-size-base);
          min-width: 20px;
          text-align: center;
        }

        .nav-text {
          flex: 1;
        }

        .nav-divider {
          height: 1px;
          background: #e5e7eb;
          margin: var(--spacing-sm) var(--spacing-md);
        }

        .user-link {
          color: #059669;
        }

        .user-link:hover,
        .user-link:focus,
        .user-link.active {
          color: #047857;
          background: #d1fae5;
        }

        .register-link {
          color: #7c3aed;
          font-weight: 600;
        }

        .register-link:hover,
        .register-link:focus,
        .register-link.active {
          color: #5b21b6;
          background: #ede9fe;
        }

        .logout-btn {
          color: #dc2626;
        }

        .logout-btn:hover,
        .logout-btn:focus {
          color: #991b1b;
          background: #fee2e2;
        }

        /* Desktop Navigation */
        .desktop-nav .nav-menu {
          flex-direction: row;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .desktop-nav .nav-divider {
          width: 1px;
          height: 20px;
          margin: 0 var(--spacing-sm);
        }

        .desktop-nav .nav-link {
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: 20px;
        }

        .desktop-nav .nav-icon {
          display: none;
        }

        /* Mobile Navigation */
        .mobile-nav {
          padding: var(--spacing-lg);
        }

        .mobile-nav .nav-link {
          font-size: var(--font-size-lg);
          padding: var(--spacing-lg) var(--spacing-md);
        }

        .mobile-nav .nav-icon {
          font-size: var(--font-size-lg);
          min-width: 24px;
        }

        /* Focus indicators for accessibility */
        .nav-link:focus {
          outline: var(--focus-ring);
          outline-offset: 2px;
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .nav-link {
            border: 1px solid transparent;
          }
          
          .nav-link:focus,
          .nav-link.active {
            border-color: currentColor;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .nav-link {
            transition: none;
          }
        }

        /* Print styles */
        @media print {
          .navigation {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
