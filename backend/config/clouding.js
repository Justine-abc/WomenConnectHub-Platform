const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'levy',
  api_key: process.env.CLOUDINARY_API_KEY || '583272472472893',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mxeGkkvde3xta5KTL5YaubA77Ls'
});

// Cloudinary storage configuration for different file types
const createCloudinaryStorage = (folder, allowedFormats) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `womenconnecthub/${folder}`,
      allowed_formats: allowedFormats,
      transformation: [
        { width: 1000, height: 1000, crop: 'limit', quality: 'auto:good' }
      ],
      public_id: (req, file) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        return `${folder}_${timestamp}_${randomString}`;
      }
    }
  });
};

// Storage configurations for different types
const storageConfigs = {
  // Profile pictures
  profilePictures: createCloudinaryStorage('profiles', ['jpg', 'jpeg', 'png', 'gif']),
  
  // Project images
  projectImages: createCloudinaryStorage('projects', ['jpg', 'jpeg', 'png', 'gif']),
  
  // Business plan documents
  documents: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'womenconnecthub/documents',
      allowed_formats: ['pdf', 'doc', 'docx'],
      resource_type: 'raw',
      public_id: (req, file) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        return `document_${timestamp}_${randomString}`;
      }
    }
  }),

  // General uploads
  general: createCloudinaryStorage('uploads', ['jpg', 'jpeg', 'png', 'gif', 'pdf'])
};

// Multer configurations
const createMulterUpload = (storageConfig, fileSize = 10 * 1024 * 1024) => {
  return multer({
    storage: storageConfig,
    limits: {
      fileSize: fileSize, // Default 10MB
      files: 5 // Maximum 5 files
    },
    fileFilter: (req, file, cb) => {
      // Check file type
      const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${file.mimetype} is not allowed`), false);
      }
    }
  });
};

// Upload configurations
const uploads = {
  profilePicture: createMulterUpload(storageConfigs.profilePictures, 5 * 1024 * 1024), // 5MB
  projectImage: createMulterUpload(storageConfigs.projectImages, 10 * 1024 * 1024), // 10MB
  document: createMulterUpload(storageConfigs.documents, 50 * 1024 * 1024), // 50MB
  general: createMulterUpload(storageConfigs.general, 20 * 1024 * 1024) // 20MB
};

// Upload helper functions
const uploadToCloudinary = async (file, folder = 'uploads') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `womenconnecthub/${folder}`,
      public_id: `${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      transformation: [
        { width: 1000, height: 1000, crop: 'limit', quality: 'auto:good' }
      ]
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

// Get optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 400,
    height = 400,
    crop = 'fill',
    quality = 'auto:good'
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: 'auto'
  });
};

// Validate Cloudinary configuration
const validateCloudinaryConfig = () => {
  const requiredVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing Cloudinary configuration: ${missing.join(', ')}`);
    return false;
  }
  
  console.log('✅ Cloudinary configuration validated');
  return true;
};

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful:', result);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error);
    return false;
  }
};

module.exports = {
  cloudinary,
  uploads,
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedImageUrl,
  validateCloudinaryConfig,
  testCloudinaryConnection,
  storageConfigs
};