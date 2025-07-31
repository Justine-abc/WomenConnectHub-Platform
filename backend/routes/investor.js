// routes/investor.js
const express = require("express");
const router = express.Router();
const investorController = require("../controllers/investorController");
const authenticate = require("../middleware/auth");

router.get("/profile", authenticate, investorController.getProfile);
router.put("/profile", authenticate, investorController.updateProfile);

module.exports = router;