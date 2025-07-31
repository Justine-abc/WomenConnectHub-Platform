// routes/email.js
const express = require("express");
const router = express.Router();
const gemailService = require("../services/gemailService");

router.post("/send", gemailService.sendEmail);

module.exports = router;