const { checkPermission, createUser, getUsers, getUserById, updateUser, deleteUser } = require('../services/user.service');
const { getDefaultPermissions, createPermission } = require('../services/permission.service');
const responseHandler = require('../utils/responseHandler');
const { decryptToken } = require('../utils/generateToken');

//~ 100% Create User
exports.createUserByForm = async (req, res) => {
  try {
    const { body } = req;

    const permissionError = await checkPermission(req, res, body.id, "create");
    if (permissionError) return;

    const requiredFields = [
      'username', 'email', 'password', 'confirmPassword',
      'department', 'experience', 'skills',
      'salary', 'appointmentDate', 'employmentType'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return responseHandler.error(res, new Error(`Missing fields: ${missingFields.join(', ')}`), 400);
    }

    const user = await createUser(body);
    if (user.error) return responseHandler.error(res, new Error(user.error), 400);
    
    if (!body.permissions) body.permissions = getDefaultPermissions(body.role);
    const [ staffData, permissionData ] = await Promise.all([
      createStaff(body, user.id),
      createPermission(body.permissions, user.id)
    ]);

    if (staffData?.error) return responseHandler.error(res, new Error(staffData.error), 400);
    if (permissionData?.error) return responseHandler.error(res, new Error(permissionData.error), 400);

    return responseHandler.created(res, user, "User and staff created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

//~ 100% Create User by Sign Up Link
exports.createUserBySignUpLink = async (req, res) => {
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
