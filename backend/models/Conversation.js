// models/Conversation.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Conversation = sequelize.define("Conversation", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  participants: { type: DataTypes.STRING, allowNull: false }, // Changed from ARRAY to STRING to match DB
}, {
  tableName: 'Conversations',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false, // This table only has createdAt
});

module.exports = Conversation;