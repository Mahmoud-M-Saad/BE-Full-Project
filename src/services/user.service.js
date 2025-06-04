const db = require('../models');
const { User } = db;
const { verifyEmail, verifyPassword, verifyUsername } = require('../services/auth.service');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const responseHandler = require('../utils/responseHandler');

const getUser = async (id) => {
  try {
    const user = await User.findOne({ where: { id }, attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires', 'createdAt', 'updatedAt'] } });
    if (!user) return { error: 'User not found' };
    return user;
  } catch (error) {
    return { error: error.message };
  }
};

exports.createUser = async (userData, options = {}) => {
  try {
    const { username, email, password, confirmPassword, role } = userData;

    if (!role === "customer") {      
      const existingUser = await User.findOne({
        where: { [db.Sequelize.Op.or]: [{ email }, { username }] },
        transaction: options.transaction
      });      
      if (existingUser) return { error: 'Sorry, This email or username already exists.' };

      verifyEmail(email);
      verifyUsername(username);
      verifyPassword(password, confirmPassword);

      if (role === 'super_admin') userData.secretKey = crypto.randomBytes(32).toString('hex');
      userData.role = role || 'customer';
      userData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.create(userData, { transaction: options.transaction });
    if (!user) return { error: 'User creation failed, Please check your input data.' };

    return user;
  } catch (error) {
    return { error: error.message };
  }
};

exports.getUsers = async () => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'phone', 'address', 'secAddress', 'role'] });
    if (!users || users.length === 0) return { error: 'No users found' };

    return users;
  } catch (error) {
    return { error: error.message };    
  }
};

exports.getUserById = async (id) => {
  try {
    const user = await getUser(id);
    if (user.error) return { error: user.error };
    return user;
  } catch (error) {
    return { error: error.message };
  }
};

exports.updateUser = async (id, userData) => {
  try {
    const userUpdated = await User.update(userData, { where: { id } });
    if (!userUpdated[0]) return { error: 'User not found or no changes made' };

    return await getUser(id);
  } catch (error) {
    return { error: error.message };
  }
};

exports.deleteUser = async (id) => {
  try {
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) return { error: 'User not found' };

    return { message: 'User deleted successfully' };
  } catch (error) {
    return { error: error.message };    
  }
};

exports.checkPermission = async (req, res, userId, action) => {
  const userPermission = req.user.permissions;
  let targetRole;
  console.log(`Checking permissions for action: ${action} on userId: ${userId}`);
  if (userId){
    const userToUpdate = await getUser(userId);
    if (!userToUpdate) return responseHandler.error(res, new Error("User not found"), 404);
    targetRole = userToUpdate.role;
  }
  targetRole = targetRole || req.body.role;

  if (targetRole === "admin" && !userPermission.writeAdmins) {
    console.log("Admin permission check failed");
    return responseHandler.error(res, new Error(`You do not have permission to ${action} an admin user. Ask your Admin.`), 403);
  }
  if (targetRole === "employee" && !userPermission.writeEmployees) {
    return responseHandler.error(res, new Error(`You do not have permission to ${action} an employee user. Ask your Admin.`), 403);
  }
  if (targetRole === "super_admin" && (!req.user.secretKey || req.user.secretKey !== req.body.secretKey)) {
    return responseHandler.error(res, new Error(`You do not have permission or invalid secret key to ${action}.`), 403);
  }
};