// Example for EntrepreneurProfile.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EntrepreneurProfile = sequelize.define("EntrepreneurProfile", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bio: { type: DataTypes.TEXT },
  skills: { type: DataTypes.STRING },
  businessCertificate: { type: DataTypes.STRING },
}, {
  timestamps: true,
});

module.exports = EntrepreneurProfile;