// routes/profiles.js
const express = require("express");
const router = express.Router();
const entrepreneurController = require("../controllers/entrepreneurController");
const investorController = require("../controllers/investorController");
const authenticate = require("../middleware/auth");

router.get("/entrepreneurs", entrepreneurController.listEntrepreneurs);
router.get("/investors", investorController.listInvestors);

module.exports = router;