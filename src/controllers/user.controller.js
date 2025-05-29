const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../services/user.service');
const { getPermissionByUserId, updatePermissionByUserId } = require('../services/permission.service');
const responseHandler = require('../utils/responseHandler');
const { decryptToken } = require('../utils/generateToken');

// Create User
exports.createUser = async (req, res) => {
  try {
    const { creation_token } = req.headers;
    const userData = await decryptToken(creation_token);
    const user = await createUser(userData);
    return responseHandler.created(res, user, "User created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

//~ 100% Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await getUsers();
    return responseHandler.success(res, users);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

//~ 100% Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (user.error) return responseHandler.error(res, new Error('User not found'), 404);
    return responseHandler.success(res, user);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    if (user.error) return responseHandler.error(res, new Error('User not found'), 404);
    return responseHandler.success(res, user, "User updated successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    if (!result) return responseHandler.error(res, new Error('User not found'), 404);
    return responseHandler.success(res, null, "User deleted successfully.");
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

//~ 100% Get Permission by User ID
exports.getPermissionByUserId = async (req, res) => {
  try {
    console.log('Fetching permission for userId:', req.params.userId); // Debugging log
    const permission = await getPermissionByUserId(req.params.userId);
    if (permission.error) return responseHandler.error(res, new Error('Permission not found'), 404);
    return responseHandler.success(res, permission);
  } catch (err) {
    console.error('Error fetching permission:', err.message); // Debugging log
    return responseHandler.error(res, err);
  }
};

//~ 100% Update Permission by User ID
exports.updatePermissionByUserId = async (req, res) => {
  try {
    const { secretKey } = req.body;
    if (!secretKey) return responseHandler.error(res, new Error('Secret key is required'), 400);

    const authHeader = req.headers['authorization'];
    if (!authHeader) return responseHandler.error(res, new Error('Authorization header is missing'), 401);

    const token = authHeader.split('Bearer ')[1];
    if (!token) return responseHandler.error(res, new Error('Bearer token is missing'), 401);

    const user = await decryptToken(token);
    if (user.error) return responseHandler.error(res, new Error('Invalid or expired token'), 401);
    if (user.role !== 'super_admin' || user.secretKey !== secretKey)
      return responseHandler.error(res, new Error('Only Super Admins can update permissions or Secret key is invalid'), 403);

    const permission = await updatePermissionByUserId(req.params.userId, req.body);
    if (permission.error) return responseHandler.error(res, new Error('Permission not found'), 404);
    return responseHandler.success(res, permission, "Permission updated successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};