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
    /^https:\/\/docs\.google\.com\/presentation\/d\/[a-zA-Z0-9_-]+/,
  ];
  
  return googleDrivePatterns.some(pattern => pattern.test(url));
};

/**
 * Converts Google Drive sharing URL to direct image URL
 * @param {string} url - Google Drive sharing URL
 * @returns {string} - Direct image URL or original URL if conversion fails
 */
export const convertGoogleDriveUrl = (url) => {
  if (!url || !validateGoogleDriveUrl(url)) return url;
  
  try {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  } catch (error) {
    console.error('Error converting Google Drive URL:', error);
  }
  
  return url;
};

/**
 * Validates if a URL is a valid web URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid URL
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
 * Validates if a URL is a valid email
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validates social media URLs
 * @param {string} url - The URL to validate
 * @param {string} platform - The platform (linkedin, twitter, instagram, facebook)
 * @returns {boolean} - True if valid social media URL
 */
export const validateSocialMediaUrl = (url, platform) => {
  if (!url || typeof url !== 'string') return false;
  
  const patterns = {
    linkedin: /^https:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/,
    twitter: /^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/,
    instagram: /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/,
    facebook: /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
  };
  
  const pattern = patterns[platform.toLowerCase()];
  return pattern ? pattern.test(url) : validateWebUrl(url);
};

/**
 * Extracts file ID from Google Drive URL
 * @param {string} url - Google Drive URL
 * @returns {string|null} - File ID or null if not found
 */
export const extractGoogleDriveFileId = (url) => {
  if (!url || !validateGoogleDriveUrl(url)) return null;
  
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return fileIdMatch ? fileIdMatch[1] : null;
};

/**
 * Formats URL for display (truncates long URLs)
 * @param {string} url - The URL to format
 * @param {number} maxLength - Maximum length to display
 * @returns {string} - Formatted URL
 */
export const formatUrlForDisplay = (url, maxLength = 50) => {
  if (!url || typeof url !== 'string') return '';
  
  if (url.length <= maxLength) return url;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname;
    
    if (domain.length + 10 >= maxLength) {
      return `${domain}...`;
    }
    
    const remainingLength = maxLength - domain.length - 3; // 3 for "..."
    const truncatedPath = path.length > remainingLength 
      ? `${path.substring(0, remainingLength)}...`
      : path;
    
    return `${domain}${truncatedPath}`;
  } catch {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  }
};

/**
 * Checks if URL is an image
 * @param {string} url - The URL to check
 * @returns {boolean} - True if URL points to an image
 */
export const isImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
  return imageExtensions.test(url);
};

/**
 * Generates a safe filename from a string
 * @param {string} filename - Original filename
 * @returns {string} - Safe filename
 */
export const generateSafeFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return 'file';
  
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
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
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Parses query string to object
 * @param {string} queryString - Query string
 * @returns {Object} - Parameters object
 */
export const parseQueryString = (queryString) => {
  if (!queryString || typeof queryString !== 'string') return {};
  
  const params = {};
  const searchParams = new URLSearchParams(queryString.startsWith('?') ? queryString.slice(1) : queryString);
  
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }
  
  return params;
};

/**
 * Gets domain from URL
 * @param {string} url - The URL
 * @returns {string} - Domain or empty string
 */
export const getDomainFromUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
};

/**
 * Adds protocol to URL if missing
 * @param {string} url - The URL
 * @param {string} protocol - Default protocol (default: 'https')
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
 * Validates and sanitizes URL input
 * @param {string} url - The URL to sanitize
 * @returns {string} - Sanitized URL
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowercaseUrl = url.toLowerCase().trim();
  
  for (const protocol of dangerousProtocols) {
    if (lowercaseUrl.startsWith(protocol)) {
      return '';
    }
  }
  
  return url.trim();
};

export default {
  validateGoogleDriveUrl,
  convertGoogleDriveUrl,
  validateWebUrl,
  validateEmail,
  validateSocialMediaUrl,
  extractGoogleDriveFileId,
  formatUrlForDisplay,
  isImageUrl,
  generateSafeFilename,
  buildQueryString,
  parseQueryString,
  getDomainFromUrl,
  ensureProtocol,
  sanitizeUrl,
};