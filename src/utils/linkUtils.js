// WomenConnect Hub - External Link Utilities
// Utilities for handling Google Drive, YouTube, and other external media links

import { UPLOAD_CONSTRAINTS, ERROR_MESSAGES } from './constants.js';

/**
 * Convert Google Drive sharing link to direct image link
 * @param {string} shareUrl - Google Drive sharing URL
 * @returns {string|null} - Direct image URL or null if invalid
 */
export const convertGoogleDriveLink = (shareUrl) => {
  const match = shareUrl.match(UPLOAD_CONSTRAINTS.GOOGLE_DRIVE_PATTERN);
  if (match && match[1]) {
    const fileId = match[1];
    return `https://lh3.googleusercontent.com/d/${fileId}=s800?authuser=0`;
  }
  return null;
};

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
export const extractYouTubeId = (url) => {
  const match = url.match(UPLOAD_CONSTRAINTS.YOUTUBE_PATTERN);
  if (match && match[3]) {
    return match[3];
  }
  return null;
};

/**
 * Extract Vimeo video ID from Vimeo URL
 * @param {string} url - Vimeo URL
 * @returns {string|null} - Video ID or null if invalid
 */
export const extractVimeoId = (url) => {
  const match = url.match(UPLOAD_CONSTRAINTS.VIMEO_PATTERN);
  if (match && match[2]) {
    return match[2];
  }
  return null;
};

/**
 * Generate YouTube thumbnail URL
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality (default, medium, high, maxres)
 * @returns {string} - Thumbnail URL
 */
export const getYouTubeThumbnail = (videoId, quality = 'medium') => {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault'
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};

/**
 * Generate Vimeo thumbnail URL
 * @param {string} videoId - Vimeo video ID
 * @returns {Promise<string|null>} - Thumbnail URL or null if error
 */
export const getVimeoThumbnail = async (videoId) => {
  try {
    const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
    const data = await response.json();
    return data[0]?.thumbnail_medium || null;
  } catch (error) {
    console.error('Error fetching Vimeo thumbnail:', error);
    return null;
  }
};

/**
 * Validate if URL is from allowed image domains
 * @param {string} url - Image URL to validate
 * @returns {boolean} - True if valid
 */
export const isValidImageUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    // Check if it's a direct image URL
    if (UPLOAD_CONSTRAINTS.IMAGE_URL_PATTERN.test(url)) {
      return true;
    }
    
    // Check if it's from allowed domains
    return UPLOAD_CONSTRAINTS.ALLOWED_IMAGE_DOMAINS.some(allowedDomain => 
      domain === allowedDomain || domain.endsWith('.' + allowedDomain)
    );
  } catch {
    return false;
  }
};

/**
 * Validate if URL is from allowed video domains
 * @param {string} url - Video URL to validate
 * @returns {boolean} - True if valid
 */
export const isValidVideoUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    return UPLOAD_CONSTRAINTS.ALLOWED_VIDEO_DOMAINS.some(allowedDomain => 
      domain === allowedDomain || domain.endsWith('.' + allowedDomain)
    );
  } catch {
    return false;
  }
};

/**
 * Process and validate image URL
 * @param {string} url - Raw image URL
 * @returns {object} - {isValid: boolean, processedUrl: string, error: string}
 */
export const processImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      processedUrl: null,
      error: ERROR_MESSAGES.REQUIRED_FIELD
    };
  }

  const trimmedUrl = url.trim();
  
  // Check if it's a Google Drive link
  const driveUrl = convertGoogleDriveLink(trimmedUrl);
  if (driveUrl) {
    return {
      isValid: true,
      processedUrl: driveUrl,
      error: null
    };
  }
  
  // Check if it's a valid image URL
  if (isValidImageUrl(trimmedUrl)) {
    return {
      isValid: true,
      processedUrl: trimmedUrl,
      error: null
    };
  }
  
  return {
    isValid: false,
    processedUrl: null,
    error: ERROR_MESSAGES.INVALID_IMAGE_URL
  };
};

/**
 * Process and validate video URL
 * @param {string} url - Raw video URL
 * @returns {object} - {isValid: boolean, type: string, videoId: string, embedUrl: string, thumbnailUrl: string, error: string}
 */
export const processVideoUrl = async (url) => {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      type: null,
      videoId: null,
      embedUrl: null,
      thumbnailUrl: null,
      error: ERROR_MESSAGES.REQUIRED_FIELD
    };
  }

  const trimmedUrl = url.trim();
  
  // Check YouTube
  const youtubeId = extractYouTubeId(trimmedUrl);
  if (youtubeId) {
    return {
      isValid: true,
      type: 'youtube',
      videoId: youtubeId,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      thumbnailUrl: getYouTubeThumbnail(youtubeId),
      error: null
    };
  }
  
  // Check Vimeo
  const vimeoId = extractVimeoId(trimmedUrl);
  if (vimeoId) {
    const thumbnailUrl = await getVimeoThumbnail(vimeoId);
    return {
      isValid: true,
      type: 'vimeo',
      videoId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      thumbnailUrl: thumbnailUrl,
      error: null
    };
  }
  
  return {
    isValid: false,
    type: null,
    videoId: null,
    embedUrl: null,
    thumbnailUrl: null,
    error: ERROR_MESSAGES.INVALID_VIDEO_URL
  };
};

/**
 * Check if image URL loads successfully
 * @param {string} url - Image URL to test
 * @returns {Promise<boolean>} - True if image loads
 */
export const testImageLoad = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout after 10 seconds
    setTimeout(() => resolve(false), 10000);
  });
};

/**
 * Get fallback placeholder image URL
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = () => {
  return '/assets/placeholder-image.svg';
};

/**
 * Generate helpful instructions for users
 * @returns {object} - Instructions for different platforms
 */
export const getLinkInstructions = () => {
  return {
    googleDrive: {
      title: "How to share from Google Drive:",
      steps: [
        "1. Upload your image to Google Drive",
        "2. Right-click the file and select 'Share'",
        "3. Change permission to 'Anyone with the link can view'",
        "4. Copy the sharing link and paste it here"
      ]
    },
    youtube: {
      title: "How to share from YouTube:",
      steps: [
        "1. Go to your YouTube video",
        "2. Click the 'Share' button below the video",
        "3. Copy the link and paste it here",
        "4. Make sure your video is public or unlisted"
      ]
    },
    general: {
      title: "Supported platforms:",
      platforms: [
        "✓ Google Drive (images)",
        "✓ Dropbox (images)", 
        "✓ YouTube (videos)",
        "✓ Vimeo (videos)",
        "✓ Direct image links (.jpg, .png, .webp)"
      ]
    }
  };
};

export default {
  convertGoogleDriveLink,
  extractYouTubeId,
  extractVimeoId,
  getYouTubeThumbnail,
  getVimeoThumbnail,
  isValidImageUrl,
  isValidVideoUrl,
  processImageUrl,
  processVideoUrl,
  testImageLoad,
  getPlaceholderImage,
  getLinkInstructions
};
