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

      // Make actual API call to backend
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Extract user data from response
      const { token, user: userData } = data;
      
      const user = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        type: userData.role,
        profile: {
          country: userData.country || '',
          city: userData.city || '',
          profileImage: userData.profileImage || '',
          businessCertificate: userData.businessCertificate || null,
        },
        createdAt: userData.createdAt,
        lastLogin: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem('wch_user', JSON.stringify(user));
      localStorage.setItem('wch_token', token);

      setUser(user);
      return user;

    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Invalid email or password. Please try again.';
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

      // Admin secret key validation (keep for frontend validation)
      if (userData.userType === 'admin') {
        const ADMIN_SECRET_KEY = '12345@#@@@@@@@@!!!!wwwgggh.';
        if (!userData.secretKey || userData.secretKey !== ADMIN_SECRET_KEY) {
          throw new Error('Invalid admin secret key. Please use the correct secret key.');
        }
      }

      if (userData.userType === 'entrepreneur' && userData.gender !== 'female') {
        throw new Error('Only female entrepreneurs can register');
      }

      // Prepare data for backend API
      const registrationData = {
        firstName: userData.firstName || userData.companyName,
        lastName: userData.lastName || '',
        email: userData.email,
        password: userData.password,
        role: userData.userType || 'entrepreneur',
        country: userData.country,
        city: userData.city,
        gender: userData.gender,
        companyName: userData.companyName,
        companyWebsite: userData.companyWebsite,
        contactInfo: userData.contactInfo
      };

      // Call real backend API
      const response = await api.post('/auth/register', registrationData);

      if (response.data.success) {
        const { user, token } = response.data;
        
        // Save to localStorage
        localStorage.setItem('wch_user', JSON.stringify(user));
        localStorage.setItem('wch_token', token);

        setUser(user);
        return user;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }

    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
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