const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../services/user.service');
const { getPermissionByUserId, updatePermissionByUserId } = require('../services/permission.service');
const responseHandler = require('../utils/responseHandler');
const { decryptToken } = require('../utils/generateToken');

const checkPermission = async (req, res, userId, action) => {
  const userPermission = req.user.permissions;
  const userToUpdate = await getUserById(userId);
  if (!userToUpdate) return responseHandler.error(res, new Error("User not found"), 404);

  const targetRole = userToUpdate.role;
  if (targetRole === "admin" && !userPermission.writeAdmin) {
    return responseHandler.error(res, new Error(`You do not have permission to ${action} an admin user. Ask your Admin.`), 403);
  }
  if (targetRole === "employee" && !userPermission.writeEmployee) {
    return responseHandler.error(res, new Error(`You do not have permission to ${action} an employee user. Ask your Admin.`), 403);
  }
  if (targetRole === "super_admin" && (!req.user.secretKey || req.user.secretKey !== req.body.secretKey)) {
    return responseHandler.error(res, new Error(`You do not have permission or invalid secret key to ${action}.`), 403);
  }
};

//~ 100% Create User
exports.createUser = async (req, res) => {
  try {
    const permissionError = await checkPermission(req, res, req.params.id, "create");
    if (permissionError) return;
    
    const user = await createUser(req.body);
    return responseHandler.created(res, user, "User created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

//~ 100% Create User by Sign Up Link
exports.createUserBySignUpLink = async (req, res) => {
  try {
    const permissionError = await checkPermission(req, res, req.params.id, "create");
    if (permissionError) return;

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
    const permissionError = await checkPermission(req, res, req.params.id, "update");
    if (permissionError) return;

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
    const permissionError = await checkPermission(req, res, req.params.id, "delete");
    if (permissionError) return;

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
    const permission = await updatePermissionByUserId(req.params.userId, req.body);
    if (permission.error) return responseHandler.error(res, new Error('Permission not found'), 404);
    return responseHandler.success(res, permission, "Permission updated successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};