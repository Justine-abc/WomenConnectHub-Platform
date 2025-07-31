// services/analyticsService.js

const Project = require("../models/Project");
const User = require("../models/User");

const getPlatformStats = async () => {
  try {
    const totalUsers = await User.count();
    const totalProjects = await Project.count();
    const totalEntrepreneurs = await User.count({ where: { role: "entrepreneur" } });
    const totalInvestors = await User.count({ where: { role: "investor" } });

    return {
      totalUsers,
      totalProjects,
      totalEntrepreneurs,
      totalInvestors,
    };
  } catch (error) {
    console.error("Analytics error:", error);
    throw new Error("Failed to fetch analytics");
  }
};

module.exports = {
  getPlatformStats,
};
