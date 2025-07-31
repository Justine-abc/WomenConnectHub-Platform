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

  // Initialize auth state on app start
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check for existing session in localStorage
      const savedUser = localStorage.getItem('wch_user');
      const savedToken = localStorage.getItem('wch_token');

      if (savedUser && savedToken) {
        try {
          const userData = JSON.parse(savedUser);

          // Validate token with backend (simulate for now)
          const isValidToken = await validateToken(savedToken);

          if (isValidToken) {
            setUser(userData);
          } else {
            // Token is invalid, clear storage
            clearAuthData();
          }
        } catch (err) {
          console.error('Error parsing saved user data:', err);
          clearAuthData();
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError('Failed to initialize authentication');
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const validateToken = async (token) => {
    try {
      // Simulate API call to validate token
      // In real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 500));

      // For demo purposes, consider token valid if it exists
      return !!token;
    } catch (err) {
      console.error('Token validation failed:', err);
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API login call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login response
      const mockUser = {
        id: 1,
        email: credentials.email,
        name: credentials.email === 'entrepreneur@test.com' ? 'Jane Entrepreneur' : 'John Investor',
        type: credentials.email === 'entrepreneur@test.com' ? 'entrepreneur' : 'investor',
        firstName: credentials.email === 'entrepreneur@test.com' ? 'Jane' : 'John',
        lastName: credentials.email === 'entrepreneur@test.com' ? 'Entrepreneur' : 'Investor',
        profile: {
          country: 'Kenya',
          city: 'Nairobi',
          profileImage: '',
          businessCertificate: credentials.email === 'entrepreneur@test.com' ? 'certificate-url' : null,
          companyName: credentials.email !== 'entrepreneur@test.com' ? 'Investment Corp' : null,
          website: credentials.email !== 'entrepreneur@test.com' ? 'https://investmentcorp.com' : null
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      const mockToken = `mock-jwt-token-${Date.now()}`;

      // Save to localStorage
      localStorage.setItem('wch_user', JSON.stringify(mockUser));
      localStorage.setItem('wch_token', mockToken);

      setUser(mockUser);
      return mockUser;

    } catch (err) {
      const errorMessage = 'Invalid email or password. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate registration data
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }

      // Admin secret key validation
      if (userData.userType === 'admin') {
        const ADMIN_SECRET_KEY = '12345@#@@@@@@@@!!!!wwwgggh.';
        if (!userData.secretKey || userData.secretKey !== ADMIN_SECRET_KEY) {
          throw new Error('Invalid admin secret key. Please use the correct secret key.');
        }
      }

      if (userData.userType === 'entrepreneur' && userData.gender !== 'female') {
        throw new Error('Only female entrepreneurs can register');
      }

      // Simulate API registration call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if email already exists (simulate)
      if (userData.email === 'existing@test.com') {
        throw new Error('An account with this email already exists');
      }

      // Create new user object
      const newUser = {
        id: Date.now(),
        email: userData.email,
        type: userData.userType,
        firstName: userData.firstName || userData.companyName,
        lastName: userData.lastName || '',
        name: userData.userType === 'entrepreneur'
          ? `${userData.firstName} ${userData.lastName}`.trim()
          : userData.userType === 'admin'
            ? `${userData.firstName} ${userData.lastName}`.trim()
            : userData.companyName,
        profile: {
          country: userData.country,
          city: userData.city,
          profileImage: userData.profileImage || '',
          businessCertificate: userData.businessCertificate || null,
          companyName: userData.companyName || null,
          website: userData.companyWebsite || null,
          contactInfo: userData.contactInfo || null,
          gender: userData.gender
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      const mockToken = `mock-jwt-token-${Date.now()}`;

      // Save to localStorage
      localStorage.setItem('wch_user', JSON.stringify(newUser));
      localStorage.setItem('wch_token', mockToken);

      setUser(newUser);
      return newUser;

    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Simulate API logout call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Clear authentication data
      clearAuthData();

    } catch (err) {
      console.error('Logout error:', err);
      // Even if logout fails, clear local data
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        ...profileData,
        profile: {
          ...user.profile,
          ...profileData.profile
        }
      };

      // Update localStorage
      localStorage.setItem('wch_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return updatedUser;

    } catch (err) {
      const errorMessage = 'Failed to update profile. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('wch_user');
    localStorage.removeItem('wch_token');
    setUser(null);
    setError(null);
  };

  const resetPassword = async (_email) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful response
      return {
        success: true,
        message: 'Password reset link sent to your email'
      };

    } catch (err) {
      const errorMessage = 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (_token) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user verification status
      if (user) {
        const updatedUser = {
          ...user,
          emailVerified: true,
          verifiedAt: new Date().toISOString()
        };

        localStorage.setItem('wch_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      return { success: true, message: 'Email verified successfully' };

    } catch (err) {
      const errorMessage = 'Email verification failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const isAuthenticated = () => !!user;
  const isEntrepreneur = () => user?.type === 'entrepreneur';
  const isInvestor = () => user?.type === 'investor';
  const isAdmin = () => user?.type === 'admin';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('wch_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    // State
    user,
    loading,
    error,
    isInitialized,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    verifyEmail,

    // Utilities
    isAuthenticated,
    isEntrepreneur,
    isInvestor,
    isAdmin,
    getAuthHeaders,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
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