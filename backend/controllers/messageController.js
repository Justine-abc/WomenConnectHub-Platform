// filepath: backend/controllers/messageController.js
const Message = require("../models/Message");

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      text
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inbox messages for the current user
const getInbox = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { receiverId: req.user.id }
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  getInbox
};