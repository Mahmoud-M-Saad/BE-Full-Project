const db = require('../models');
const Project = db.Project;

exports.createProject = async (projectData) => {
    try {
        const project = await Project.create(projectData);
        if (!project) return { error: 'Project creation failed' };
        return project;
    } catch (error) {
        return { error: error.message };
    }
};

exports.getProjects = async () => {
    try {
        const projects = await Project.findAll();
        if (!projects) return { error: 'No projects found' };
        return projects;
    } catch (error) {
        return { error: error.message };
    }
};

exports.getProjectById = async (id) => {
    try {
        const project = await Project.findByPk(id);
        if (!project) return { error: 'Project not found' };
        return project;
    } catch (error) {
        return { error: error.message };
    }
};

exports.updateProject = async (id, projectData) => {
    try {
        const updated = await Project.update(projectData, { where: { id } });
        if (!updated[0]) return { error: 'Project not found' };
        const project = await Project.findByPk(id);
        return project;
    } catch (error) {
        return { error: error.message };
    }
};

exports.deleteProject = async (id) => {
    try {
        const deleted = await Project.destroy({ where: { id } });
        if (!deleted) return { error: 'Project not found' };
        return { message: 'Project deleted successfully' };
    } catch (error) {
        return { error: error.message };
    }
};