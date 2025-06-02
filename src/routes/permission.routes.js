const express = require('express');
const router = express.Router();
const { getPermissionByUserId, updatePermissionByUserId } = require('../controllers/permission.controller');

//! middleware validation function
const { isSuperAdmin, isAuth } = require('../middlewares/auth.middleware');

router.get('/:userId', isAuth, getPermissionByUserId);
router.put('/:userId', isSuperAdmin, updatePermissionByUserId);

module.exports = router;