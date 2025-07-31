const sequelize = require("../config/database");

const Interaction = sequelize.define("Interaction", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING }, // e.g., 'view', 'like'
});

module.exports = Interaction;