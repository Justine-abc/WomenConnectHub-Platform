// utils/helpers.js

const path = require("path");
const fs = require("fs");

const generateUsername = (name, id) => {
  return `${name.toLowerCase().replace(/\s+/g, "")}_${id}`;
};

const deleteLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Failed to delete file:", err.message);
  });
};

const isImageTypeAllowed = (mimetype, allowedTypes) => {
  return allowedTypes.includes(mimetype);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB");
};

module.exports = {
  generateUsername,
  deleteLocalFile,
  isImageTypeAllowed,
  formatDate,
};
