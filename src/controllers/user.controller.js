const { checkPermission, createUser, getUsers, getUserById, updateUser, deleteUser } = require('../services/user.service');
const { createPermission, getDefaultPermissions } = require('../services/permission.service');
const { createStaffData, getStaffByUserIdWithProjectsTasks, updateStaffData } = require('../services/staff.service');
const { getProjectsByStaffIdWithTasks } = require('../services/project.service');
const responseHandler = require('../utils/responseHandler');
const { decryptToken } = require('../utils/generateToken');
const db = require('../models');

//~ 100% Create User
const createStaff = async (req, res) => {
  try {
    const { body } = req;
    const requiredFields = [
      'username', 'email', 'password', 'confirmPassword', 'role',
      'department', 'experience', 'skills',
      'salary', 'appointmentDate', 'employmentType'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return responseHandler.error(res, new Error(`Missing fields: ${missingFields.join(', ')}`), 400);
    }
    
    const permissionError = await checkPermission(req, res, "", "create");
    if (permissionError) return;

    //^ Start transaction
    const t = await db.sequelize.transaction();
    try {
      const user = await createUser(body, { transaction: t });
      if (user.error) throw new Error(user.error);

      if (!body.permissions) {
        body.permissions = getDefaultPermissions(body.role)
      }
      body.permissions.role = body.role;
      body.permissions.userId = user.id;

      const staffData = await createStaffData(body, user.id, { transaction: t });
      if (staffData?.error) throw new Error(staffData.error);

      const permissionData = await createPermission(body.permissions, { transaction: t });
      if (permissionData?.error) throw new Error(permissionData.error);

      // ✅ Assign existing projects to staff
      if (Array.isArray(body.projectIds) && body.projectIds.length > 0) {
        await staffData.addProjects(body.projectIds, { transaction: t });
      }

      await t.commit();
      return responseHandler.created(res, user, "User created successfully.");
    } catch (err) {
      await t.rollback();
      return responseHandler.error(res, err, 400);
    }
  } catch (error) {
    console.error("Error creating staff:", error);
    return responseHandler.error(res, error, 400);
  }
};

//~ 100% Create User by Sign Up Link
const createCustomer = async (req, res) => {
  try {
    const { creation_token } = req.headers;
    const { role } = req.body;
    const userData = await decryptToken(creation_token);

    let user;
    if (role === "super_admin" || role === "admin" || role === "employee" ) {
      user = await createStaff(req,res);
    }else{
      user = await createUser(userData);
    }

    if (user.error) return responseHandler.error(res, new Error(user.error), 400);
    return responseHandler.created(res, user, "User created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

//~ 100% Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await getUsers();
    return responseHandler.success(res, users);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

//~ 100% Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (user.error) return responseHandler.error(res, new Error('User not found'), 404);
    
    const staffData = await getStaffByUserIdWithProjectsTasks(user.id);
    if (!staffData) return user;

    const data = { ...user.dataValues, ...staffData.dataValues };
    return responseHandler.success(res, data, "User fetched successfully.");
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

//~ 100% Update User
const updateUser = async (req, res) => {
  try {
    const { phone, address, secAddress, department, experience, skills, salary, appointmentDate, employmentType } = req.body;
    
    const permissionError = await checkPermission(req, res, req.params.id, "update");
    if (permissionError) return;

    const userData = { phone, address, secAddress }
    const user = await updateUser(req.params.id, userData);
    console.log(user);
    if (user.error) return responseHandler.error(res, new Error('User not found'), 404);

    if (department || experience || skills || salary || appointmentDate || employmentType) {
      const staffData = { department, experience, skills, salary, appointmentDate, employmentType }
      await updateStaffData(req.params.id, staffData);
    };

    return responseHandler.success(res, user, "User updated successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

//~ 100% Delete User
const deleteUser = async (req, res) => {
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


module.exports = {
  createStaff,
  createCustomer,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}