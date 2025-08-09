// models/index.js
require("dotenv").config();
const sequelize = require("../config/database");
const User = require("./User");
const Project = require("./Project");
const Message = require("./Message");
const EntrepreneurProfile = require("./EntrepreneurProfile");
const InvestorProfile = require("./InvestorProfile");
const Interaction = require("./Interaction");
const Conversation = require("./Conversation");
require("./associations")();

module.exports = {
  sequelize,
  User,
  Project,
  Message,
  EntrepreneurProfile,
  InvestorProfile,
  Interaction,
  Conversation,
};