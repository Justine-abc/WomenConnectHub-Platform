// models/Project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define("Project", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  location: DataTypes.STRING,
  imageUrl: DataTypes.STRING,
});

module.exports = Project;