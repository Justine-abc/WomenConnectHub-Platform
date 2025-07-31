
// controllers/investorController.js
const InvestorProfile = require("../models/InvestorProfile");

const createInvestorProfile = async (req, res) => {
  try {
    const profile = await InvestorProfile.create({ ...req.body, userId: req.user.id });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllInvestorProfiles = async (req, res) => {
  try {
    const profiles = await InvestorProfile.findAll();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createInvestorProfile, getAllInvestorProfiles };
