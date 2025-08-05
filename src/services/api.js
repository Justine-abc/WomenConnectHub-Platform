const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9007/api';

// API configuration
const apiConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('wch_token');
};

// Create authenticated headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    ...apiConfig.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...apiConfig,
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API request failed:', error);
    return { data: null, error: error.message };
  }
};

// Authentication API
export const authAPI = {
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  refreshToken: () =>
    apiRequest('/auth/refresh', {
      method: 'POST',
    }),

  forgotPassword: (email) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, password) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

// User API
export const userAPI = {
  getProfile: () => apiRequest('/user/profile'),

  updateProfile: (profileData) =>
    apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  deleteAccount: () =>
    apiRequest('/user/account', {
      method: 'DELETE',
    }),

  changePassword: (passwordData) =>
    apiRequest('/user/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    }),
};

// Projects API
export const projectsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/projects${queryParams ? `?${queryParams}` : ''}`);
  },

  getById: (id) => apiRequest(`/projects/${id}`),

  create: (projectData) =>
    apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }),

  update: (id, projectData) =>
    apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    }),

  delete: (id) =>
    apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    }),

  search: (query, filters = {}) =>
    apiRequest('/projects/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    }),

  getCategories: () => apiRequest('/projects/categories'),

  uploadImage: (formData) =>
    apiRequest('/projects/upload-image', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    }),
};

// Investments API
export const investmentsAPI = {
  create: (investmentData) =>
    apiRequest('/investments', {
      method: 'POST',
      body: JSON.stringify(investmentData),
    }),

  getMyInvestments: () => apiRequest('/investments/my-investments'),

  getByProject: (projectId) => apiRequest(`/investments/project/${projectId}`),

  update: (id, updateData) =>
    apiRequest(`/investments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),

  getPortfolio: () => apiRequest('/investments/portfolio'),

  getAnalytics: () => apiRequest('/investments/analytics'),
};

// Messaging API
export const messagingAPI = {
  getThreads: () => apiRequest('/messages/threads'),

  getThread: (threadId) => apiRequest(`/messages/threads/${threadId}`),

  sendMessage: (messageData) =>
    apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),

  markAsRead: (messageId) =>
    apiRequest(`/messages/${messageId}/read`, {
      method: 'PUT',
    }),

  deleteMessage: (messageId) =>
    apiRequest(`/messages/${messageId}`, {
      method: 'DELETE',
    }),

  searchMessages: (query) =>
    apiRequest('/messages/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
};

// Admin API
export const adminAPI = {
  getUsers: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryParams ? `?${queryParams}` : ''}`);
  },

  updateUserStatus: (userId, status) =>
    apiRequest(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  getDashboardStats: () => apiRequest('/admin/dashboard'),

  getProjectReports: () => apiRequest('/admin/projects/reports'),

  approveProject: (projectId) =>
    apiRequest(`/admin/projects/${projectId}/approve`, {
      method: 'PUT',
    }),

  rejectProject: (projectId, reason) =>
    apiRequest(`/admin/projects/${projectId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),
};

// File upload API
export const uploadAPI = {
  uploadFile: (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return apiRequest('/upload', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    });
  },

  deleteFile: (fileId) =>
    apiRequest(`/upload/${fileId}`, {
      method: 'DELETE',
    }),
};

// Export the main API request function for custom calls
export { apiRequest };

// Default export for convenience
const api = {
  auth: authAPI,
  user: userAPI,
  projects: projectsAPI,
  investments: investmentsAPI,
  messaging: messagingAPI,
  admin: adminAPI,
  upload: uploadAPI,
};

export default api;