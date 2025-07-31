// utils/constants.js

module.exports = {
  ROLES: {
    ENTREPRENEUR: "entrepreneur",
    INVESTOR: "investor",
    ADMIN: "admin",
  },

  DEFAULT_COUNTRY: "Rwanda",

  PROJECT_CATEGORIES: ["Crafts", "Clothing", "Food", "Services", "Others"],

  MAX_IMAGE_SIZE_MB: 2,

  EMAIL_TEMPLATES: {
    PROJECT_APPROVED: (name) =>
      `Hello ${name},\n\nYour project has been reviewed and approved. It is now visible on WomenConnect Hub.\n\nThank you!`,
    ACCOUNT_CREATED: (name) =>
      `Hi ${name},\n\nYour account has been successfully created on WomenConnect Hub. Start uploading your projects today!`,
  },

  VALID_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
};
