// routes/projects.js
const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authenticate = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", authenticate, upload.single("projectImage"), projectController.createProject);
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.put("/:id", authenticate, upload.single("projectImage"), projectController.updateProject);
router.delete("/:id", authenticate, projectController.deleteProject);

module.exports = router;