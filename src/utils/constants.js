// User Types
export const USER_TYPES = {
  ENTREPRENEUR: 'entrepreneur',
  INVESTOR: 'investor',
  ADMIN: 'admin',
};

// Project Categories
export const PROJECT_CATEGORIES = [
  'Technology & Innovation',
  'Fashion & Textiles',
  'Beauty & Cosmetics',
  'Food & Beverage',
  'Agriculture & Farming',
  'Arts & Crafts',
  'Healthcare & Wellness',
  'Education & Training',
  'Finance & Banking',
  'Retail & E-commerce',
  'Manufacturing',
  'Services',
  'Other',
];

// Countries (African countries focus)
export const COUNTRIES = [
  'Algeria',
  'Angola',
  'Benin',
  'Botswana',
  'Burkina Faso',
  'Burundi',
  'Cameroon',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Comoros',
  'Democratic Republic of Congo',
  'Republic of Congo',
  'Djibouti',
  'Egypt',
  'Equatorial Guinea',
  'Eritrea',
  'Eswatini',
  'Ethiopia',
  'Gabon',
  'Gambia',
  'Ghana',
  'Guinea',
  'Guinea-Bissau',
  'Ivory Coast',
  'Kenya',
  'Lesotho',
  'Liberia',
  'Libya',
  'Madagascar',
  'Malawi',
  'Mali',
  'Mauritania',
  'Mauritius',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Niger',
  'Nigeria',
  'Rwanda',
  'São Tomé and Príncipe',
  'Senegal',
  'Seychelles',
  'Sierra Leone',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Sudan',
  'Tanzania',
  'Togo',
  'Tunisia',
  'Uganda',
  'Zambia',
  'Zimbabwe',
  // Additional countries for diversity
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Other',
];

// Project Status
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ACTIVE: 'active',
  FUNDED: 'funded',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
};

// Investment Status
export const INVESTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Message Priority
export const MESSAGE_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Message Status
export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
};

// File Types
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALL: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// File Size Limits (in bytes)
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [6, 12, 24, 48],
};

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  BUSINESS_DESCRIPTION_MIN_LENGTH: 20,
  PROJECT_DESCRIPTION_MIN_LENGTH: 50,
  MESSAGE_MAX_LENGTH: 1000,
  SUBJECT_MAX_LENGTH: 100,
};

// Investment Ranges
export const INVESTMENT_RANGES = [
  { value: '1000-5000', label: '$1,000 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000-25000', label: '$10,000 - $25,000' },
  { value: '25000-50000', label: '$25,000 - $50,000' },
  { value: '50000+', label: '$50,000+' },
];

// Risk Levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Funding Goals
export const FUNDING_GOALS = [
  { min: 0, max: 5000, label: 'Under $5,000' },
  { min: 5000, max: 10000, label: '$5,000 - $10,000' },
  { min: 10000, max: 25000, label: '$10,000 - $25,000' },
  { min: 25000, max: 50000, label: '$25,000 - $50,000' },
  { min: 50000, max: 100000, label: '$50,000 - $100,000' },
  { min: 100000, max: null, label: '$100,000+' },
];

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
  TIME: 'HH:mm',
};

// Colors for charts and indicators
export const COLORS = {
  PRIMARY: '#2563eb',
  SUCCESS: '#059669',
  WARNING: '#d97706',
  ERROR: '#dc2626',
  INFO: '#0891b2',
  GRAY: '#6b7280',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  PROJECTS: '/projects',
  INVESTMENTS: '/investments',
  MESSAGES: '/messages',
  ADMIN: '/admin',
  UPLOAD: '/upload',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
  FILTERS: 'savedFilters',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size is too large.',
  INVALID_FILE_TYPE: 'Invalid file type.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  PROJECT_CREATED: 'Project created successfully!',
  PROJECT_UPDATED: 'Project updated successfully!',
  INVESTMENT_MADE: 'Investment made successfully!',
  MESSAGE_SENT: 'Message sent successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
};

// Theme Configuration
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Animation Durations (in milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};

export default {
  USER_TYPES,
  PROJECT_CATEGORIES,
  COUNTRIES,
  PROJECT_STATUS,
  INVESTMENT_STATUS,
  MESSAGE_PRIORITY,
  MESSAGE_STATUS,
  ALLOWED_FILE_TYPES,
  FILE_SIZE_LIMITS,
  PAGINATION,
  VALIDATION,
  INVESTMENT_RANGES,
  RISK_LEVELS,
  FUNDING_GOALS,
  DATE_FORMATS,
  COLORS,
  API_ENDPOINTS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  THEME,
  ANIMATION,
  BREAKPOINTS,
};