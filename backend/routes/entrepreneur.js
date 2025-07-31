// routes/entrepreneur.js
const express = require("express");
const router = express.Router();
const entrepreneurController = require("../controllers/entrepreneurController");
const authenticate = require("../middleware/auth");

router.get("/profile", authenticate, entrepreneurController.getProfile);
router.put("/profile", authenticate, entrepreneurController.updateProfile);

module.exports = router;