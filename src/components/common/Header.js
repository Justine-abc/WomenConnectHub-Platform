// WomenConnect Hub - Header Component
// Main navigation header for the platform

import React, { useState } from 'react';
import { Container } from '../ui/index.js';
import Navigation from './Navigation.js';

const Header = ({ user, onLogout, currentPath = '/' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header" role="banner">
      <Container>
        <div className="flex-between">
          {/* Logo/Brand */}
          <div className="nav-brand-container">
            <a href="/" className="nav-brand" onClick={closeMobileMenu}>
              <span className="sr-only">WomenConnect Hub - </span>
              WomenConnect Hub
            </a>
            <p className="nav-tagline">
              Empowering African Women Entrepreneurs
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-desktop">
            <Navigation 
              user={user} 
              onLogout={onLogout} 
              currentPath={currentPath}
              isMobile={false}
              onLinkClick={closeMobileMenu}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="menu-toggle nav-mobile"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="mobile-menu nav-mobile">
            <Navigation 
              user={user} 
              onLogout={onLogout} 
              currentPath={currentPath}
              isMobile={true}
              onLinkClick={closeMobileMenu}
            />
          </div>
        )}
      </Container>

      <style jsx>{`
        .nav-brand-container {
          display: flex;
          flex-direction: column;
        }

        .nav-brand {
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .nav-brand:hover,
        .nav-brand:focus {
          color: #1d4ed8;
        }

        .nav-tagline {
          font-size: var(--font-size-xs);
          color: #6b7280;
          margin: 0;
          display: none;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          width: 24px;
          height: 18px;
          justify-content: space-between;
          cursor: pointer;
        }

        .hamburger span {
          display: block;
          height: 3px;
          width: 100%;
          background: #374151;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 50;
        }

        @media (min-width: 768px) {
          .nav-tagline {
            display: block;
          }

          .nav-brand {
            font-size: var(--font-size-xl);
          }
        }

        /* Focus indicators for accessibility */
        .menu-toggle:focus {
          outline: var(--focus-ring);
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .nav-brand {
            border-bottom: 2px solid transparent;
          }
          
          .nav-brand:focus {
            border-bottom-color: currentColor;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
