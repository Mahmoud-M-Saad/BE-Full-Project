const db = require('../models');
const Task = db.Task;

exports.createTask = async (taskData) => {
    try {
        const task = await Task.create(taskData);
        if (!task) return { error: 'Task creation failed' };
        return task;
    } catch (error) {
        return { error: error.message };
    }
};

exports.getTasks = async () => {
    try {
        const tasks = await Task.findAll();
        if (!tasks) return { error: 'No tasks found' };
        return tasks;
    } catch (error) {
        return { error: error.message };
    }
};

exports.getTaskById = async (id) => {
    try {
        const task = await Task.findByPk(id);
        if (!task) return { error: 'Task not found' };
        return task;
    } catch (error) {
        return { error: error.message };
    }
};

exports.updateTask = async (id, taskData) => {
    try {
        const updated = await Task.update(taskData, { where: { id } });
        if (!updated[0]) return { error: 'Task not found' };
        const task = await Task.findByPk(id);
        return task;
    } catch (error) {
        return { error: error.message };
    }
};

exports.deleteTask = async (id) => {
    try {
        const deleted = await Task.destroy({ where: { id } });
        if (!deleted) return { error: 'Task not found' };
        return { message: 'Task deleted successfully' };
    } catch (error) {
        return { error: error.message };
    }
};