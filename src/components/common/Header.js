import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

const Header = ({ currentPath = '/' }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-blue-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center text-white no-underline" onClick={closeMobileMenu}>
              <span className="bg-white text-blue-800 px-3 py-2 rounded-md font-bold text-xl">
                WCH
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <Link to="/" className={`text-white no-underline font-medium py-2 transition-colors hover:text-yellow-400 ${currentPath === '/' ? 'text-yellow-400 border-b-2 border-yellow-400' : ''}`}>
              Home
            </Link>
            <Link to="/projects" className={`text-white no-underline font-medium py-2 transition-colors hover:text-yellow-400 ${currentPath === '/projects' ? 'text-yellow-400 border-b-2 border-yellow-400' : ''}`}>
              Projects
            </Link>
            <Link to="/entrepreneurs" className={`text-white no-underline font-medium py-2 transition-colors hover:text-yellow-400 ${currentPath === '/entrepreneurs' ? 'text-yellow-400 border-b-2 border-yellow-400' : ''}`}>
              Entrepreneurs
            </Link>
            <Link to="/investors" className={`text-white no-underline font-medium py-2 transition-colors hover:text-yellow-400 ${currentPath === '/investors' ? 'text-yellow-400 border-b-2 border-yellow-400' : ''}`}>
              Investors
            </Link>
            <Link to="/about" className={`text-white no-underline font-medium py-2 transition-colors hover:text-yellow-400 ${currentPath === '/about' ? 'text-yellow-400 border-b-2 border-yellow-400' : ''}`}>
              About
            </Link>
            <Link to="/contact" className={`text-white no-underline font-medium py-2 transition-colors hover:text-yellow-400 ${currentPath === '/contact' ? 'text-yellow-400 border-b-2 border-yellow-400' : ''}`}>
              Contact
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <div className="hidden md:flex items-center space-x-4">
                {user?.role === 'entrepreneur' && (
                  <Link to="/entrepreneur-dashboard" className="text-white no-underline py-2 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10">
                    Dashboard
                  </Link>
                )}
                {user?.role === 'investor' && (
                  <Link to="/investor-portal" className="text-white no-underline py-2 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10">
                    Portal
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin-dashboard" className="text-white no-underline py-2 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10">
                    Admin
                  </Link>
                )}
                <Link to="/messages" className="text-white no-underline py-2 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10">
                  Messages
                </Link>
                <span className="text-white text-sm">
                  Hello, {user?.firstName || user?.name || 'User'}
                </span>
                <button onClick={logout} className="border border-white text-white py-2 px-4 rounded-md cursor-pointer transition-all hover:bg-white hover:text-blue-800">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/auth" className="text-white no-underline py-2 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10">
                  Login
                </Link>
                <Link to="/auth" className="bg-yellow-400 text-blue-800 no-underline py-2 px-4 rounded-md font-semibold transition-colors hover:bg-yellow-500">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex bg-transparent border-none text-white cursor-pointer p-2"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className={`flex flex-col w-6 h-5 justify-between ${isMobileMenuOpen ? 'transform' : ''}`}>
                <span className={`block h-0.5 w-full bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-white rounded transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-800 border-t border-white border-opacity-20 shadow-lg">
            <nav className="flex flex-col p-4 space-y-2">
              <Link to="/" className="text-white no-underline py-3 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10" onClick={closeMobileMenu}>
                Home
              </Link>
              <Link to="/projects" className="text-white no-underline py-3 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10" onClick={closeMobileMenu}>
                Projects
              </Link>
              <Link to="/entrepreneurs" className="text-white no-underline py-3 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10" onClick={closeMobileMenu}>
                Entrepreneurs
              </Link>
              <Link to="/investors" className="text-white no-underline py-3 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10" onClick={closeMobileMenu}>
                Investors
              </Link>
              <Link to="/about" className="text-white no-underline py-3 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10" onClick={closeMobileMenu}>
                About
              </Link>
              <Link to="/contact" className="text-white no-underline py-3 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10" onClick={closeMobileMenu}>
                Contact
              </Link>
              
              {isAuthenticated() ? (
                <>
                  {user?.role === 'entrepreneur' && (
                    <Link to="/entrepreneur-dashboard" className="text-white no-underline py-3 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10" onClick={closeMobileMenu}>
                      Dashboard
                    </Link>
                  )}
                  {user?.role === 'investor' && (
                    <Link to="/investor-portal" className="text-white no-underline py-3 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10" onClick={closeMobileMenu}>
                      Portal
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin-dashboard" className="text-white no-underline py-3 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10" onClick={closeMobileMenu}>
                      Admin
                    </Link>
                  )}
                  <Link to="/messages" className="text-white no-underline py-3 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10" onClick={closeMobileMenu}>
                    Messages
                  </Link>
                  <button onClick={logout} className="border border-white text-white py-3 px-4 rounded-md cursor-pointer transition-all hover:bg-white hover:text-blue-800 mt-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white no-underline py-3 px-4 rounded-md transition-colors hover:bg-white hover:bg-opacity-10" onClick={closeMobileMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="bg-yellow-400 text-blue-800 no-underline py-3 px-4 rounded-md font-semibold transition-colors hover:bg-yellow-500" onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
