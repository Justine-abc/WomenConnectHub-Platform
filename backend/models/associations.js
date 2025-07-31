// models/associations.js
const User = require("./User");
const Project = require("./Project");
const Message = require("./Message");
const EntrepreneurProfile = require("./EntrepreneurProfile");
const InvestorProfile = require("./InvestorProfile");
const Interaction = require("./Interaction");

User.hasMany(Project);
Project.belongsTo(User);

User.hasMany(Message, { foreignKey: "senderId" });
User.hasMany(Message, { foreignKey: "receiverId" });

User.hasOne(EntrepreneurProfile);
EntrepreneurProfile.belongsTo(User);

User.hasOne(InvestorProfile);
InvestorProfile.belongsTo(User);

User.hasMany(Interaction);
Interaction.belongsTo(User);

Project.hasMany(Interaction);
Interaction.belongsTo(Project);

module.exports = () => {
  // call this to apply all associations
};