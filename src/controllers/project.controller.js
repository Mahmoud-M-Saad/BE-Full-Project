const projectService = require('../services/project.service');
const responseHandler = require('../utils/responseHandler');

// Create Project
exports.createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body);
    return responseHandler.created(res, project, "Project created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Get All Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects();
    return responseHandler.success(res, projects);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Get Project by ID
exports.getProject = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) return responseHandler.error(res, new Error("Project not found"), 404);
    return responseHandler.success(res, project);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    if (!project) return responseHandler.error(res, new Error("Project not found"), 404);
    return responseHandler.success(res, project, "Project updated successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const result = await projectService.deleteProject(req.params.id);
    if (!result) return responseHandler.error(res, new Error("Project not found"), 404);
    return responseHandler.success(res, null, "Project deleted successfully.");
  } catch (err) {
    return responseHandler.error(res, err);
  }
};
