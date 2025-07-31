// controllers/adminController.js
const { getPlatformStats } = require("../services/analyticsServices");

const getDashboardStats = async (req, res) => {
  try {
    const stats = await getPlatformStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboardStats };