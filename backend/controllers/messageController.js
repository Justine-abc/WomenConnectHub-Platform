// controllers/messageController.js
const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      senderId: req.user.id,
      receiverId: req.body.receiverId,
      content: req.body.content,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id },
        ],
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendMessage, getMessages };