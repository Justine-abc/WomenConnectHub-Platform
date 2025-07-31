// controllers/entrepreneurController.js
const EntrepreneurProfile = require("../models/EntrepreneurProfile");

const createEntrepreneurProfile = async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.create({ ...req.body, userId: req.user.id });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEntrepreneurProjects = async (req, res) => {
  try {
    const projects = await EntrepreneurProfile.findAll({ where: { userId: req.user.id } });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createEntrepreneurProfile, getEntrepreneurProjects };