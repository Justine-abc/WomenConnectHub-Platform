// middleware/upload.js
const multer = require("multer");
const path = require("path");
const { VALID_IMAGE_TYPES } = require("../utils/constants");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (VALID_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;