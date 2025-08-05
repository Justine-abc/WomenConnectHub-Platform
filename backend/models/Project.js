// models/Project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define("Project", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fundingGoal: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  timeline: {
    type: DataTypes.STRING(50)
  },
  teamSize: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  imageUrl: {
    type: DataTypes.STRING(500)
  },
  videoUrl: {
    type: DataTypes.STRING(500)
  },
  businessPlan: {
    type: DataTypes.STRING(500)
  },
  targetMarket: {
    type: DataTypes.TEXT
  },
  competitiveAdvantage: {
    type: DataTypes.TEXT
  },
  previousExperience: {
    type: DataTypes.STRING(100)
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'completed', 'cancelled'),
    defaultValue: 'draft'
  },
  entrepreneur: {
    type: DataTypes.JSON
  }
}, {
  tableName: 'Projects',
  timestamps: true
});

module.exports = Project;