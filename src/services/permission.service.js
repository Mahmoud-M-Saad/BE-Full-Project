const db = require('../models');
const Permission = db.Permission;

exports.getDefaultPermissions = (role) => {
  switch (role) {
    case 'super_admin':
      return {
        readAdmins: true, writeAdmins: true,
        readEmployees: true, writeEmployees: true,
        readProjects: true, writeProjects: true,
        readTasks: true, writeTasks: true,
        readProducts: true, writeProducts: true
      };
    case 'admin':
      return {
        readEmployees: true,
        readProjects: true,
        readTasks: true,
        readProducts: true
      };
    default:
      return {}; // fallback for other roles
  }
}

exports.createPermission = async (permissions, options = {}) => {
  try {
    const permission = await Permission.create(permissions, { transaction: options.transaction });
    if (!permission) return { error: 'Permission creation failed' };

    return permission;
  } catch (error) {
    return { error: error.message };
  }
};

exports.getPermissionByUserId = async (userId) => {
  try {
    const permission = await Permission.findOne({ where: { userId } });
    if (!permission) return { error: 'Permission not found' };

    return permission;
  } catch (error) {
    return { error: error.message };
  }
};

exports.updatePermissionByUserId = async (userId, permissionData) => {
  try {
    const permission = await Permission.findOne({ where: { userId } });
    if (!permission) return { error: 'Permission not found' };
    
    const permissionUpdated = await Permission.update(permissionData, { where: { userId } });
    if (!permissionUpdated) return { error: 'Permission update failed' };
    
    return await Permission.findOne({ where: { userId } });
  } catch (error) {
    return { error: error.message };
  }
};