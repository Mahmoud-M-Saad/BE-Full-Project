const db = require('../models');
const Permission = db.Permission;

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
