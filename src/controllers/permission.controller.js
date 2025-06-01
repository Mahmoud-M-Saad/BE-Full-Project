const { getPermissionByUserId, updatePermissionByUserId } = require('../services/permission.service');
const responseHandler = require('../utils/responseHandler');



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