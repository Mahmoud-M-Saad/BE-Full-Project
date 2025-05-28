const userService = require('../services/user.service');
const responseHandler = require('../utils/responseHandler');
const { decryptToken } = require('../utils/generateToken');

// Create User
exports.createUser = async (req, res) => {
  try {
    const { creation_token } = req.headers;
    const userData = await decryptToken(creation_token);
    const user = await userService.createUser(userData);
    return responseHandler.created(res, user, "User created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

//~ 100%  Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    return responseHandler.success(res, users);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

//~ 100% Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user.error) return responseHandler.error(res, new Error('User not found'), 404);
    return responseHandler.success(res, user);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (user.error) return responseHandler.error(res, new Error('User not found'), 404);
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
