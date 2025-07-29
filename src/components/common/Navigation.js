import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ mobile = false, onLinkClick, user }) => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/projects', label: 'Projects', icon: '🚀' },
    { path: '/entrepreneurs', label: 'Entrepreneurs', icon: '👩‍💼' },
    { path: '/investors', label: 'Investors', icon: '💰' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📞' },
  ];

  const userLinks = user ? [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ] : [];

  const isActive = (path) => location.pathname === path;

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive(link.path)
                ? 'bg-white bg-opacity-20 text-yellow-400'
                : 'text-white hover:bg-white hover:bg-opacity-10'
            }`}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
        
        {userLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive(link.path)
                ? 'bg-white bg-opacity-20 text-yellow-400'
                : 'text-white hover:bg-white hover:bg-opacity-10'
            }`}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`text-white font-medium py-2 transition-colors hover:text-yellow-400 relative ${
            isActive(link.path) ? 'text-yellow-400' : ''
          }`}
        >
          {link.label}
          {isActive(link.path) && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"></span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;