const express = require('express');
const router = express.Router();
const { createStaff, getAllUsers, getUserById, updateUser, deleteUser, createCustomer } = require('../controllers/user.controller');

//! middleware validation function
const { validateAdminCreate, validateAdminUpdate } = require('../middlewares/validators/user.validator');
const { isSuperAdmin, isAuth } = require('../middlewares/auth.middleware');

//! basic CRUD routes
router.post('/add-staff', isAuth, validateAdminCreate, createStaff);
router.post('/add-customer', createCustomer);
router.get('/', isAuth, getAllUsers);
router.get('/:id', isAuth, getUserById);
router.put('/:id', isAuth, updateUser);
router.delete('/:id', isAuth, deleteUser);

module.exports = router;