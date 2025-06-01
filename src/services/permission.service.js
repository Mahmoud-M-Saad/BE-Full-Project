const db = require('../models');
const Permission = db.Permission;


// Helper function to assign default permissions
exports.getDefaultPermissions = (role) => {
  switch (role) {
    case 'super_admin':
      return {
        readProjects: true, writeProjects: true,
        readTasks: true, writeTasks: true,
        readProducts: true, writeProducts: true
      };
    case 'admin':
      return {
        readProjects: true,
        readTasks: true,
        readProducts: true
      };
    default:
      return {}; // fallback for other roles
  }
}

exports.createPermission = async (userId) => {
    try {
        const permission = await Permission.create({ userId });
        if (!permission) throw new Error('Permission creation failed');
        return permission;
    } catch (error) {
        return { error: error.message };
    }
};

exports.getPermissionByUserId = async (userId) => {
    try {
        const permission = await Permission.findOne({ where: { userId } });

        if (!permission) throw new Error('Permission not found');
        return permission;
    } catch (error) {
        return { error: error.message };
    }
};

exports.updatePermissionByUserId = async (userId, permissionData) => {
    try {
        const permission = await Permission.findOne({ where: { userId } });
        if (!permission) throw new Error('Permission not found');

        await Permission.update(permissionData, { where: { userId } });
        return await Permission.findOne({ where: { userId } });
    } catch (error) {
        return { error: error.message };
    }
};
