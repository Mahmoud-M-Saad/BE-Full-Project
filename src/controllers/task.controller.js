const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../services/task.service');
const responseHandler = require('../utils/responseHandler');

// Create Task
exports.createTask = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.writeTasks){
      return responseHandler.error(res, new Error("You do not have permission to create a task. Ask your Admin."), 403);
    }
    const task = await createTask(req.body);
    return responseHandler.created(res, task, "Task created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.readTasks){
      return responseHandler.error(res, new Error("You do not have permission to read tasks. Ask your Admin."), 403);
    }
    const tasks = await getTasks();
    return responseHandler.success(res, tasks);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Get Task by ID
exports.getTask = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.readTasks){
      return responseHandler.error(res, new Error("You do not have permission to read a task. Ask your Admin."), 403);
    }
    const task = await getTaskById(req.params.id);
    if (!task) return responseHandler.error(res, new Error("Task not found"), 404);
    return responseHandler.success(res, task);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.writeTasks){
      return responseHandler.error(res, new Error("You do not have permission to update a task. Ask your Admin."), 403);
    }
    const task = await updateTask(req.params.id, {status: req.body.status, description: req.body.description});
    if (!task) return responseHandler.error(res, new Error("Task not found"), 404);
    return responseHandler.success(res, task, "Task updated successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.writeTasks){
      return responseHandler.error(res, new Error("You do not have permission to delete a task. Ask your Admin."), 403);
    }
    const result = await deleteTask(req.params.id);
    if (!result) return responseHandler.error(res, new Error("Task not found"), 404);
    return responseHandler.success(res, null, "Task deleted successfully.");
  } catch (err) {
    return responseHandler.error(res, err);
  }
};
