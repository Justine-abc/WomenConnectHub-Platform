import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';
import { USER_TYPES, STORAGE_KEYS } from '../utils/constants';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Action types
const ActionTypes = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ActionTypes.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case ActionTypes.AUTH_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case ActionTypes.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null,
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({ type: ActionTypes.AUTH_SUCCESS, payload: user });
        } else {
          dispatch({ type: ActionTypes.AUTH_FAILURE, payload: null });
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        dispatch({ type: ActionTypes.AUTH_FAILURE, payload: null });
      }
    };

    loadStoredUser();
  }, []);

  // Store user data in localStorage
  const storeUserData = (user, token) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  };

  // Clear user data from localStorage
  const clearUserData = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  };

  // Login function
  const login = async (credentials) => {
    dispatch({ type: ActionTypes.AUTH_START });

    try {
      const { data, error } = await authAPI.login(credentials);

      if (error) {
        throw new Error(error);
      }

      const { user, token } = data;
      storeUserData(user, token);
      dispatch({ type: ActionTypes.AUTH_SUCCESS, payload: user });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: ActionTypes.AUTH_FAILURE, payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: ActionTypes.AUTH_START });

    try {
      const { data, error } = await authAPI.register(userData);

      if (error) {
        throw new Error(error);
      }

      const { user, token } = data;
      storeUserData(user, token);
      dispatch({ type: ActionTypes.AUTH_SUCCESS, payload: user });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: ActionTypes.AUTH_FAILURE, payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      clearUserData();
      dispatch({ type: ActionTypes.LOGOUT });
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const { data, error } = await userAPI.updateProfile(profileData);

      if (error) {
        throw new Error(error);
      }

      const updatedUser = { ...state.user, ...data };
      storeUserData(updatedUser, localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
      dispatch({ type: ActionTypes.UPDATE_PROFILE, payload: data });

      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      dispatch({ type: ActionTypes.AUTH_FAILURE, payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const { data, error } = await userAPI.changePassword(passwordData);

      if (error) {
        throw new Error(error);
      }

      return { success: true, message: data.message };
    } catch (error) {
      const errorMessage = error.message || 'Password change failed';
      throw new Error(errorMessage);
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      const { data, error } = await authAPI.forgotPassword(email);

      if (error) {
        throw new Error(error);
      }

      return { success: true, message: data.message };
    } catch (error) {
      const errorMessage = error.message || 'Password reset request failed';
      throw new Error(errorMessage);
    }
  };

  // Reset password function
  const resetPassword = async (token, password) => {
    try {
      const { data, error } = await authAPI.resetPassword(token, password);

      if (error) {
        throw new Error(error);
      }

      return { success: true, message: data.message };
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed';
      throw new Error(errorMessage);
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.type === role;
  };

  // Check if user is entrepreneur
  const isEntrepreneur = () => hasRole(USER_TYPES.ENTREPRENEUR);

  // Check if user is investor
  const isInvestor = () => hasRole(USER_TYPES.INVESTOR);

  // Check if user is admin
  const isAdmin = () => hasRole(USER_TYPES.ADMIN);

  // Get user display name
  const getUserDisplayName = () => {
    if (!state.user) return 'Guest';
    
    if (state.user.firstName && state.user.lastName) {
      return `${state.user.firstName} ${state.user.lastName}`;
    }
    
    return state.user.name || state.user.email || 'User';
  };

  // Get user avatar
  const getUserAvatar = () => {
    return state.user?.profile?.profileImage || state.user?.avatar || '';
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const { data, error } = await authAPI.refreshToken();

      if (error) {
        throw new Error(error);
      }

      const { token } = data;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

      return { success: true };
    } catch (error) {
      // If refresh fails, logout user
      logout();
      throw new Error('Session expired. Please login again.');
    }
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
    clearError,
    
    // Utilities
    hasRole,
    isEntrepreneur,
    isInvestor,
    isAdmin,
    getUserDisplayName,
    getUserAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// HOC for protecting routes
export const withAuth = (Component, allowedRoles = []) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">Please login to access this page.</p>
          </div>
        </div>
      );
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.type)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default AuthContext;