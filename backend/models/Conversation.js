// models/Conversation.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Conversation = sequelize.define("Conversation", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  participants: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
});

module.exports = Conversation;