export const USER_TYPES = {
  ENTREPRENEUR: 'entrepreneur',
  INVESTOR: 'investor',
  ADMIN: 'admin'
};

export const PROJECT_CATEGORIES = [
  'Fashion & Clothing',
  'Arts & Crafts',
  'Technology',
  'Agriculture',
  'Food & Beverage',
  'Health & Beauty',
  'Education',
  'Other'
];

export const COUNTRIES = [
  'Kenya', 'Nigeria', 'South Africa', 'Ghana', 'Uganda', 
  'Tanzania', 'Rwanda', 'Ethiopia', 'Morocco', 'Egypt'
];

export const FUNDING_GOALS = {
  MIN: 500,
  MAX: 100000
};

export const FILE_UPLOAD_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png']
};