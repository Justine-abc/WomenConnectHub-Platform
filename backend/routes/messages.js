// routes/messages.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authenticate = require("../middleware/auth");

router.post("/send", authenticate, messageController.sendMessage);
router.get("/inbox", authenticate, messageController.getInbox);

module.exports = router;