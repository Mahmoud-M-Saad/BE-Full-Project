const userService = require('../services/user.service');
const responseHandler = require('../utils/responseHandler');

// Create User
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return responseHandler.created(res, user, "User created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    return responseHandler.success(res, users);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return responseHandler.error(res, new Error('User not found'), 404);
    return responseHandler.success(res, user);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return responseHandler.error(res, new Error('User not found'), 404);
    return responseHandler.success(res, user, "User updated successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    if (!result) return responseHandler.error(res, new Error('User not found'), 404);
    return responseHandler.success(res, null, "User deleted successfully.");
  } catch (err) {
    return responseHandler.error(res, err);
  }
};
