const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require('../services/project.service');
const responseHandler = require('../utils/responseHandler');

// Create Project
exports.createProject = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.writeProjects){
      return responseHandler.error(res, new Error("You do not have permission to create a project. Ask your Admin."), 403);
    }
    const project = await createProject(req.body);
    return responseHandler.created(res, project, "Project created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

//~ 100% Get All Projects
exports.getProjects = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.readProjects){
      return responseHandler.error(res, new Error("You do not have permission to read projects. Ask your Admin."), 403);
    }
    const projects = await getProjects();
    return responseHandler.success(res, projects);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Get Project by ID
exports.getProject = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.readProjects){
      return responseHandler.error(res, new Error("You do not have permission to read a project. Ask your Admin."), 403);
    }
    const project = await getProjectById(req.params.id);
    if (!project) return responseHandler.error(res, new Error("Project not found"), 404);
    return responseHandler.success(res, project);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.writeProjects){
      return responseHandler.error(res, new Error("You do not have permission to update a project. Ask your Admin."), 403);
    }
    const project = await updateProject(req.params.id, { status: req.body.status, description: req.body.description });
    if (!project) return responseHandler.error(res, new Error("Project not found"), 404);
    return responseHandler.success(res, project, "Project updated successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.writeProjects){
      return responseHandler.error(res, new Error("You do not have permission to delete a project. Ask your Admin."), 403);
    }
    const result = await deleteProject(req.params.id);
    if (!result) return responseHandler.error(res, new Error("Project not found"), 404);
    return responseHandler.success(res, null, "Project deleted successfully.");
  } catch (err) {
    return responseHandler.error(res, err);
  }
};
