// models/Message.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  senderId: { type: DataTypes.INTEGER, allowNull: false },
  receiverId: { type: DataTypes.INTEGER, allowNull: false },
  text: DataTypes.TEXT, // Changed from 'content' to 'text' to match DB schema
}, {
  tableName: 'Messages',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false, // This table only has createdAt
});

module.exports = Message;