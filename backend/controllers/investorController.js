const InvestorProfile = require("../models/InvestorProfile");


// List all investors

const listInvestors = async (req, res) => {
  try {
    const investors = await InvestorProfile.findAll();
    res.status(200).json(investors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Create a new investor profile
const createInvestorProfile = async (req, res) => {
  try {
    const profile = await InvestorProfile.create({ ...req.body, userId: req.user.id });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all investor profiles
const getAllInvestorProfiles = async (req, res) => {
  try {
    const profiles = await InvestorProfile.findAll();
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the current user's investor profile
const getProfile = async (req, res) => {
  try {
    const profile = await InvestorProfile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the current user's investor profile
const updateProfile = async (req, res) => {
  try {
    const profile = await InvestorProfile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    await profile.update(req.body);
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listInvestors,
  createInvestorProfile,
  getAllInvestorProfiles,
  getProfile,
  updateProfile
};