// backend/models/associations.js
const User = require("./User");
const Project = require("./Project");
const Message = require("./Message");
const EntrepreneurProfile = require("./EntrepreneurProfile");
const InvestorProfile = require("./InvestorProfile");
const Interaction = require("./Interaction");

User.hasMany(Project, { foreignKey: "userId" });
Project.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Message, { foreignKey: "senderId" });
User.hasMany(Message, { foreignKey: "receiverId" });

User.hasOne(EntrepreneurProfile, { foreignKey: "userId" });
EntrepreneurProfile.belongsTo(User, { foreignKey: "userId" });

User.hasOne(InvestorProfile, { foreignKey: "userId" });
InvestorProfile.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Interaction, { foreignKey: "userId" });
Interaction.belongsTo(User, { foreignKey: "userId" });

Project.hasMany(Interaction, { foreignKey: "projectId" });
Interaction.belongsTo(Project, { foreignKey: "projectId" });

module.exports = () => {};