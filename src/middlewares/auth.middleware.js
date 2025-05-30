const { decryptToken } = require('../utils/generateToken');
const { error } = require('../utils/responseHandler');
const { Permission } = require('../models');
const { where } = require('sequelize');

const authLogic = async (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new Error('Authorization header is missing');

    const token = authHeader.split('Bearer ')[1];
    if (!token) throw new Error('Bearer token is missing');

    const decoded = await decryptToken(token);
    if (!decoded) throw new Error('Invalid token payload');

    const permissions = await Permission.findOne({ where: { userId: decoded.id } });
    if (!permissions) throw new Error('Permissions not found');

    req.user = { ...decoded, permissions };
    req.isAdmin = decoded.role === 'admin';
    req.isSuperAdmin = decoded.role === 'super_admin';
    req.isEmployee = decoded.role === 'employee';
};

const isAuth = async (req, res, next) => {
    try {
        await authLogic(req);
        next();
    } catch (err) {
        return error(res, err, 401);
    }
};

const isSuperAdmin = async (req, res, next) => {
    try {
        await authLogic(req); 

        if (!req.isSuperAdmin) {
            return error(res, new Error('Only Super Admins can access this resource.'), 403);
        }

        if (!req.body.secretKey || req.body.secretKey !== req.user.secretKey) {
            return error(res, new Error('Secret key is missing or invalid'), 403);
        }

        next();
    } catch (err) {
        return error(res, err, 401);
    }
};

module.exports = { isAuth, isSuperAdmin };