const db = require('../models');
const Task = db.Task;

exports.createTask = async (taskData) => {
    return await Task.create(taskData);
};

exports.getTasks = async () => {
    return await Task.findAll();
};

exports.getTaskById = async (id) => {
    return await Task.findByPk(id);
};

exports.updateTask = async (id, taskData) => {
    await Task.update(taskData, { where: { id } });
    return await Task.findByPk(id);
};

exports.deleteTask = async (id) => {
    return await Task.destroy({ where: { id } });
};