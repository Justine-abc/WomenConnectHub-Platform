/**
 * URL Helper Functions
 * Contains utilities for validating and manipulating URLs
 */

/**
 * Validates if a URL is a valid Google Drive link
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid Google Drive URL
 */
export const validateGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const googleDrivePatterns = [
    /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+/,
    /^https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+/,
    /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]+/,
    /^https:\/\/docs\.google\.com\/presentation\/d\/[a-zA-Z0-9_-]+/
  ];
  
  return googleDrivePatterns.some(pattern => pattern.test(url));
};

/**
 * Validates if a URL is a valid YouTube link
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid YouTube URL
 */
export const validateYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const youtubePatterns = [
    /^https:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/,
    /^https:\/\/youtu\.be\/[a-zA-Z0-9_-]+/,
    /^https:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+/,
    /^https:\/\/(www\.)?youtube\.com\/v\/[a-zA-Z0-9_-]+/
  ];
  
  return youtubePatterns.some(pattern => pattern.test(url));
};

/**
 * Validates if a string is a valid email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validates if a URL is a valid web URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid web URL
 */
export const validateWebUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};



/**
 * Validates social media URLs
 * @param {string} url - The URL to validate
 * 
 * @returns {boolean} - True if valid social media URL
 */
export const validateSocialMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const socialMediaPatterns = [
    
    /^https:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+/,
    /^https:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9._]+/
  ];
  
  return socialMediaPatterns.some(pattern => pattern.test(url));
};

/**
 * Converts Google Drive shareable link to direct view link
 * @param {string} url - Google Drive shareable URL
 * @returns {string} - Direct view URL
 */
export const convertGoogleDriveUrl = (url) => {
  if (!validateGoogleDriveUrl(url)) return url;
  
  // Extract file ID from various Google Drive URL formats
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  return url;
};

/**
 * Creates a Google Drive view URL from file ID
 * @param {string} fileId - Google Drive file ID
 * @returns {string} - View URL
 */
export const createGoogleDriveViewUrl = (fileId) => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

/**
 * Extracts Google Drive file ID from URL
 * @param {string} url - Google Drive URL
 * @returns {string|null} - File ID or null
 */
export const extractGoogleDriveFileId = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return fileIdMatch ? fileIdMatch[1] : null;
};

/**
 * Extracts YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null
 */
export const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  // Handle different YouTube URL formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

/**
 * Formats URL for display (truncates if too long)
 * @param {string} url - URL to format
 * @param {number} maxLength - Maximum length
 * @returns {string} - Formatted URL
 */
export const formatUrlForDisplay = (url, maxLength = 50) => {
  if (!url || typeof url !== 'string') return '';
  
  if (url.length <= maxLength) return url;
  
  return url.substring(0, maxLength - 3) + '...';
};

/**
 * Checks if URL points to an image
 * @param {string} url - URL to check
 * @returns {boolean} - True if likely an image URL
 */
export const isImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const lowerUrl = url.toLowerCase();
  
  return imageExtensions.some(ext => lowerUrl.includes(ext));
};

/**
 * Generates a safe filename from a string
 * @param {string} str - String to convert
 * @returns {string} - Safe filename
 */
export const generateSafeFilename = (str) => {
  if (!str || typeof str !== 'string') return 'file';
  
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
};

/**
 * Builds query string from object
 * @param {Object} params - Parameters object
 * @returns {string} - Query string
 */
export const buildQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';
  
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Parses query string to object
 * @param {string} queryString - Query string to parse
 * @returns {Object} - Parsed parameters
 */
export const parseQueryString = (queryString) => {
  if (!queryString || typeof queryString !== 'string') return {};
  
  const params = {};
  const searchParams = new URLSearchParams(queryString.startsWith('?') ? queryString.slice(1) : queryString);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

/**
 * Extracts domain from URL
 * @param {string} url - URL to extract domain from
 * @returns {string|null} - Domain or null
 */
export const getDomainFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
};

/**
 * Ensures URL has protocol
 * @param {string} url - URL to check
 * @param {string} protocol - Default protocol
 * @returns {string} - URL with protocol
 */
export const ensureProtocol = (url, protocol = 'https') => {
  if (!url || typeof url !== 'string') return '';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  return `${protocol}://${url}`;
};

/**
 * Sanitizes URL by removing potentially harmful characters
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  // Remove potentially harmful characters
  return url
    .replace(/[<>'"]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim();
};

const urlHelpers = {
  validateGoogleDriveUrl,
  validateYouTubeUrl,
  validateEmail,
  validateWebUrl,
  validateSocialMediaUrl,
  convertGoogleDriveUrl,
  createGoogleDriveViewUrl,
  extractGoogleDriveFileId,
  extractYouTubeId,
  formatUrlForDisplay,
  isImageUrl,
  generateSafeFilename,
  buildQueryString,
  parseQueryString,
  getDomainFromUrl,
  ensureProtocol,
  sanitizeUrl,
};

export default urlHelpers;