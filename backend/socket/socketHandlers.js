// socket/socketHandlers.js
const { Message, Conversation, User } = require("../models");

const socketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    // Join a user to their own room by user ID
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room.`);
    });

    // Handle sending a message
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      try {
        const conversation = await Conversation.findOrCreate({
          where: {
            participants: [senderId, receiverId].sort().join("_"),
          },
        });

        const message = await Message.create({
          senderId,
          receiverId,
          text,
          conversationId: conversation[0].id,
        });

        // Emit the message to receiver's room
        io.to(receiverId).emit("receiveMessage", message);
      } catch (err) {
        console.error("Socket error on sendMessage:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
  });
};

module.exports = socketHandlers;