const db = require('../models');
const Permission = db.Permission;

exports.getPermissionByUserId = async (userId) => {
    try {
        console.log('Fetching permission for userId:', userId); // Debugging log
        const permission = await Permission.findOne({ where: { userId } });

        if (!permission) throw new Error('Permission not found');
        return permission;
    } catch (error) {
        console.error('Error fetching permission:', error.message); // Debugging log
        return { error: error.message };        
    }
};

exports.updatePermissionByUserId = async (userId, permissionData) => {
    try {
        console.log('Updating permission for userId:', userId, 'with data:', permissionData); // Debugging log
        const permission = await Permission.findOne({ where: { userId } });
        if (!permission) throw new Error('Permission not found');

        await Permission.update(permissionData, { where: { userId } });
        return await Permission.findOne({ where: { userId } });
    } catch (error) {
        console.error('Error updating permission:', error.message); // Debugging log
        return { error: error.message };
    }
};
