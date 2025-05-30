const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser, getPermissionByUserId, updatePermissionByUserId, createUserBySignUpLink } = require('../controllers/user.controller');

//! middleware validation function
const { validateAdminCreate, validateAdminUpdate } = require('../middlewares/validators/user.validator');
const { isSuperAdmin, isAuth } = require('../middlewares/auth.middleware');

//! basic CRUD routes
router.post('/', isAuth, validateAdminCreate, createUser);
router.get('/', isAuth, getUsers);
router.get('/:id', isAuth, getUserById);
router.put('/:id', isAuth, updateUser);
router.delete('/:id', isAuth, deleteUser);

//! permission routes
router.get('/permissions/:userId', isAuth, getPermissionByUserId);
router.put('/permissions/:userId', isSuperAdmin, updatePermissionByUserId);

//! Sign Up link creation routes
router.post('/createUser', isAuth, validateAdminCreate, createUserBySignUpLink);

module.exports = router;