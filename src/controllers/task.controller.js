const taskService = require('../services/task.service');
const responseHandler = require('../utils/responseHandler');

// Create Task
exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    return responseHandler.created(res, task, "Task created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks();
    return responseHandler.success(res, tasks);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Get Task by ID
exports.getTask = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) return responseHandler.error(res, new Error("Task not found"), 404);
    return responseHandler.success(res, task);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    if (!task) return responseHandler.error(res, new Error("Task not found"), 404);
    return responseHandler.success(res, task, "Task updated successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id);
    if (!result) return responseHandler.error(res, new Error("Task not found"), 404);
    return responseHandler.success(res, null, "Task deleted successfully.");
  } catch (err) {
    return responseHandler.error(res, err);
  }
};
