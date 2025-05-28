const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller');

//! middleware validation function
const { validateAdminCreate, validateAdminUpdate } = require('../middlewares/validators/user.validator');

//! basic CRUD routes
router.post('/createUser', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', validateAdminUpdate, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;