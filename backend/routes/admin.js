const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticate = require("../middleware/auth");

router.get("/dashboard", authenticate, adminController.getDashboardStats);

module.exports = router;