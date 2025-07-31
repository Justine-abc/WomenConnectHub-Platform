// models/EntrepreneurProfile.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EntrepreneurProfile = sequelize.define("EntrepreneurProfile", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bio: DataTypes.TEXT,
  skills: DataTypes.STRING,
  businessCertificate: DataTypes.STRING,
});

module.exports = EntrepreneurProfile;