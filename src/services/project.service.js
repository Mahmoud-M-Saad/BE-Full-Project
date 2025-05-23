const db = require('../models');
const Project = db.Project;

exports.createProject = async (projectData) => {
    return await Project.create(projectData);
};

exports.getProjects = async () => {
    return await Project.findAll();
};

exports.getProjectById = async (id) => {
    return await Project.findByPk(id);
};

exports.updateProject = async (id, projectData) => {
    await Project.update(projectData, { where: { id } });
    return await Project.findByPk(id);
};

exports.deleteProject = async (id) => {
    return await Project.destroy({ where: { id } });
};