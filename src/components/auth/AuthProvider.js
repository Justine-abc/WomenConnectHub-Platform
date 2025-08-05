import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage on app start
  const initializeAuth = useCallback(() => {
    setLoading(true);
    const savedUser = localStorage.getItem('wch_user');
    const savedToken = localStorage.getItem('wch_token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // Clear corrupt data
        localStorage.removeItem('wch_user');
        localStorage.removeItem('wch_token');
        setUser(null);
      }
    }
    setLoading(false);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        throw new Error('First name, last name, email, and password are required');
      }

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('wch_user', JSON.stringify(data.user));
      localStorage.setItem('wch_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('wch_user', JSON.stringify(data.user));
      localStorage.setItem('wch_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('wch_user');
    localStorage.removeItem('wch_token');
    setUser(null);
  };

  const clearError = () => setError(null);

  const isAuthenticated = () => !!user;

  const value = {
    user,
    loading,
    error,
    isInitialized,

    
    register,
    login,
    logout,
    clearError,
    isAuthenticated,

  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// Higher-order component for protecting routes
export const withAuth = (Component, allowedRoles = []) => {
  return (props) => {
    const { user, loading, isInitialized } = useAuth();

    // Show loading while initializing
    if (!isInitialized || loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Redirect if not authenticated
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
            <button className="btn-primary">
              Sign In
            </button>
          </div>
        </div>
      );
    }

    // Check role permissions
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.type)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <button
              className="btn-primary"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default AuthProvider;