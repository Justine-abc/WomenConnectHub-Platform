// WomenConnect Hub - Application Constants
// Platform-specific constants for African women entrepreneurs

// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    TIMEOUT: 10000, // 10 seconds for slower connections
    RETRY_ATTEMPTS: 3
};

// User Roles
export const USER_ROLES = {
    SELLER: 'seller',           // Women entrepreneurs
    INVESTOR: 'investor',       // Investors/sponsors
    ADMIN: 'admin'              // Platform administrators
};

// Project Categories (tailored for African entrepreneurs)
export const PROJECT_CATEGORIES = {
    FASHION: 'fashion',         // Traditional wear, modern clothing
    CRAFTS: 'crafts',          // Handmade items, pottery, jewelry
    FOOD: 'food',              // Local cuisine, processed foods
    BEAUTY: 'beauty',          // Natural products, cosmetics
    TEXTILES: 'textiles',      // Weaving, embroidery, fabrics
    AGRICULTURE: 'agriculture', // Farming, agro-processing
    TECHNOLOGY: 'technology',   // Tech solutions, apps
    SERVICES: 'services',      // Consulting, training
    EDUCATION: 'education',    // Teaching, tutoring
    HEALTH: 'health',          // Healthcare services, products
    OTHER: 'other'
};

// Project Category Labels (user-friendly names)
export const CATEGORY_LABELS = {
    [PROJECT_CATEGORIES.FASHION]: 'Fashion & Clothing',
    [PROJECT_CATEGORIES.CRAFTS]: 'Arts & Crafts',
    [PROJECT_CATEGORIES.FOOD]: 'Food & Beverages',
    [PROJECT_CATEGORIES.BEAUTY]: 'Beauty & Personal Care',
    [PROJECT_CATEGORIES.TEXTILES]: 'Textiles & Fabrics',
    [PROJECT_CATEGORIES.AGRICULTURE]: 'Agriculture & Farming',
    [PROJECT_CATEGORIES.TECHNOLOGY]: 'Technology & Innovation',
    [PROJECT_CATEGORIES.SERVICES]: 'Services & Consulting',
    [PROJECT_CATEGORIES.EDUCATION]: 'Education & Training',
    [PROJECT_CATEGORIES.HEALTH]: 'Health & Wellness',
    [PROJECT_CATEGORIES.OTHER]: 'Other'
};

// African Countries (major markets for the platform)
export const COUNTRIES = [
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenya' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'GH', name: 'Ghana' },
    { code: 'UG', name: 'Uganda' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'CI', name: 'Côte d\'Ivoire' },
    { code: 'MA', name: 'Morocco' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'EG', name: 'Egypt' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' },
    { code: 'BW', name: 'Botswana' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'AO', name: 'Angola' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CD', name: 'Democratic Republic of Congo' },
    { code: 'OTHER', name: 'Other' }
];

// Project Status
export const PROJECT_STATUS = {
    DRAFT: 'draft',             // Being created
    PENDING: 'pending',         // Awaiting approval
    APPROVED: 'approved',       // Live on platform
    REJECTED: 'rejected',       // Not approved
    ARCHIVED: 'archived'        // No longer active
};

// Investment/Support Ranges (in USD)
export const INVESTMENT_RANGES = [
    { id: 'micro', label: 'Micro ($1 - $500)', min: 1, max: 500 },
    { id: 'small', label: 'Small ($501 - $2,000)', min: 501, max: 2000 },
    { id: 'medium', label: 'Medium ($2,001 - $10,000)', min: 2001, max: 10000 },
    { id: 'large', label: 'Large ($10,001 - $50,000)', min: 10001, max: 50000 },
    { id: 'enterprise', label: 'Enterprise ($50,000+)', min: 50001, max: null }
];

// File Upload Constraints (External Links)
export const UPLOAD_CONSTRAINTS = {
    // Image Links (Google Drive, Dropbox, etc.)
    ALLOWED_IMAGE_DOMAINS: [
        'drive.google.com',
        'lh3.googleusercontent.com', // Google Drive direct links
        'dropbox.com',
        'dl.dropboxusercontent.com',
        'onedrive.live.com',
        'imgur.com',
        'i.imgur.com',
        'cdn.unsplash.com',
        'images.unsplash.com'
    ],

    // Video Links (YouTube, Vimeo, etc.)
    ALLOWED_VIDEO_DOMAINS: [
        'youtube.com',
        'www.youtube.com',
        'youtu.be',
        'vimeo.com',
        'player.vimeo.com'
    ],

    MAX_IMAGES_PER_PROJECT: 5,
    MAX_VIDEOS_PER_PROJECT: 2,

    // URL validation patterns
    IMAGE_URL_PATTERN: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i,
    GOOGLE_DRIVE_PATTERN: /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    YOUTUBE_PATTERN: /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    VIMEO_PATTERN: /^https?:\/\/(www\.)?vimeo\.com\/([0-9]+)/
};

// Form Validation Rules
export const VALIDATION_RULES = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[+]?[\d\s\-()]{10,}$/, // International phone format
    PASSWORD: {
        MIN_LENGTH: 8,
        REQUIRE_UPPERCASE: false, // Relaxed for accessibility
        REQUIRE_LOWERCASE: false,
        REQUIRE_NUMBER: true,
        REQUIRE_SPECIAL: false
    },
    PROJECT_TITLE: {
        MIN_LENGTH: 5,
        MAX_LENGTH: 100
    },
    PROJECT_DESCRIPTION: {
        MIN_LENGTH: 50,
        MAX_LENGTH: 2000
    }
};

// UI Constants
export const UI_CONSTANTS = {
    DEBOUNCE_DELAY: 300,        // Search debounce
    TOAST_DURATION: 5000,       // 5 seconds
    PAGE_SIZE: 12,              // Projects per page
    MAX_SEARCH_RESULTS: 100,
    MIN_TOUCH_TARGET: 44,       // 44px minimum for mobile
    BREAKPOINTS: {
        MOBILE: 320,
        TABLET: 768,
        DESKTOP: 1024,
        WIDE: 1200
    }
};

// Error Messages (user-friendly)
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Please check your internet connection and try again.',
    INVALID_IMAGE_URL: 'Please provide a valid image link (Google Drive, Dropbox, or direct image URL).',
    INVALID_VIDEO_URL: 'Please provide a valid YouTube or Vimeo link.',
    UNSUPPORTED_LINK: 'This link is not supported. Please use Google Drive, YouTube, or other supported platforms.',
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    WEAK_PASSWORD: 'Password must be at least 8 characters with a number.',
    PROJECT_TITLE_SHORT: 'Project title must be at least 5 characters.',
    DESCRIPTION_SHORT: 'Project description must be at least 50 characters.',
    UNAUTHORIZED: 'Please log in to access this feature.',
    SERVER_ERROR: 'Something went wrong. Please try again later.',
    IMAGE_LOAD_ERROR: 'Could not load image. Please check the link and try again.',
    VIDEO_LOAD_ERROR: 'Could not load video. Please check the link and try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    REGISTRATION_SUCCESS: 'Welcome! Please check your email to verify your account.',
    LOGIN_SUCCESS: 'Welcome back!',
    PROJECT_SUBMITTED: 'Your project has been submitted for approval.',
    PROJECT_UPDATED: 'Your project has been updated successfully.',
    PROFILE_UPDATED: 'Your profile has been updated.',
    EMAIL_VERIFIED: 'Your email has been verified successfully.',
    PASSWORD_RESET_SENT: 'Password reset instructions have been sent to your email.'
};

// Navigation Menu Items
export const NAV_ITEMS = {
    PUBLIC: [
        { path: '/', label: 'Home', icon: 'home' },
        { path: '/projects', label: 'Browse Projects', icon: 'grid' },
        { path: '/about', label: 'About', icon: 'info' },
        { path: '/contact', label: 'Contact', icon: 'mail' }
    ],
    SELLER: [
        { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/my-projects', label: 'My Projects', icon: 'folder' },
        { path: '/upload', label: 'Upload Project', icon: 'plus' },
        { path: '/profile', label: 'Profile', icon: 'user' }
    ],
    INVESTOR: [
        { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/projects', label: 'Browse Projects', icon: 'grid' },
        { path: '/saved', label: 'Saved Projects', icon: 'bookmark' },
        { path: '/profile', label: 'Profile', icon: 'user' }
    ],
    ADMIN: [
        { path: '/admin', label: 'Admin Dashboard', icon: 'dashboard' },
        { path: '/admin/projects', label: 'Project Approval', icon: 'check' },
        { path: '/admin/users', label: 'User Management', icon: 'users' },
        { path: '/admin/analytics', label: 'Analytics', icon: 'chart' }
    ]
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'wch_auth_token',
    USER_DATA: 'wch_user_data',
    THEME_PREFERENCE: 'wch_theme',
    SEARCH_HISTORY: 'wch_search_history',
    SAVED_PROJECTS: 'wch_saved_projects'
};

// Feature Flags (for gradual rollout)
export const FEATURES = {
    EMAIL_VERIFICATION: true,
    SMS_NOTIFICATIONS: false,    // Future feature
    MULTI_LANGUAGE: false,       // Future feature
    ADVANCED_SEARCH: true,
    PROJECT_BOOKMARKS: true,
    REAL_TIME_CHAT: false,       // Future feature
    PAYMENT_INTEGRATION: false   // Not needed per requirements
};

// Social Media Platforms (for sharing)
export const SOCIAL_PLATFORMS = {
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
    WHATSAPP: 'whatsapp',
    LINKEDIN: 'linkedin'
};

// Time Zones (common African time zones)
export const TIMEZONES = [
    { value: 'Africa/Lagos', label: 'West Africa Time (WAT)' },
    { value: 'Africa/Cairo', label: 'Egypt Standard Time (EET)' },
    { value: 'Africa/Johannesburg', label: 'South Africa Standard Time (SAST)' },
    { value: 'Africa/Nairobi', label: 'East Africa Time (EAT)' },
    { value: 'Africa/Casablanca', label: 'Western European Time (WET)' }
];

// Help Topics (for user guidance)
export const HELP_TOPICS = [
    { id: 'getting-started', title: 'Getting Started Guide' },
    { id: 'upload-project', title: 'How to Upload Your Project' },
    { id: 'profile-setup', title: 'Setting Up Your Profile' },
    { id: 'finding-investors', title: 'Connecting with Investors' },
    { id: 'photo-tips', title: 'Taking Great Project Photos' },
    { id: 'account-security', title: 'Keeping Your Account Secure' }
];

export const APP_NAME = 'WomenConnect Hub';
export const MAX_IMAGE_SIZE_MB = 2;

export default {
    API_CONFIG,
    USER_ROLES,
    PROJECT_CATEGORIES,
    CATEGORY_LABELS,
    COUNTRIES,
    PROJECT_STATUS,
    INVESTMENT_RANGES,
    UPLOAD_CONSTRAINTS,
    VALIDATION_RULES,
    UI_CONSTANTS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    NAV_ITEMS,
    STORAGE_KEYS,
    FEATURES,
    SOCIAL_PLATFORMS,
    TIMEZONES,
    HELP_TOPICS,
    APP_NAME,
    MAX_IMAGE_SIZE_MB
};