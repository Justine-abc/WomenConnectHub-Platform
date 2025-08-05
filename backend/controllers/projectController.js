// filepath: backend/controllers/projectController.js
const Project = require("../models/Project");

// Create a new project
const createProject = async (req, res) => {
  try {
    console.log('Create project request from user:', req.user?.id, req.user?.email);
    console.log('Request body:', req.body);
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const project = await Project.create({
      ...req.body,
      imageUrl: req.file ? req.file.path : null,
      userId: req.user.id // Always use authenticated user's ID
    });
    
    console.log('Project created successfully:', project.id);
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Build where clause based on query parameters
    const whereClause = {};
    if (userId) {
      whereClause.userId = userId;
    }
    
    const projects = await Project.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']] // Show newest projects first
    });
    
    res.status(200).json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    await project.update({
      ...req.body,
      imageUrl: req.file ? req.file.path : project.imageUrl
    });
    res.status(200).json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    await project.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
};