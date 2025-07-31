// controllers/projectController.js
const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, userId: req.user.id });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createProject, getAllProjects };