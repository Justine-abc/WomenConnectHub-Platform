// models/InvestorProfile.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InvestorProfile = sequelize.define("InvestorProfile", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  companyName: DataTypes.STRING,
  website: DataTypes.STRING,
  country: DataTypes.STRING,
  city: DataTypes.STRING,
});

module.exports = InvestorProfile;