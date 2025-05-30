const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTask, updateTask, deleteTask } = require('../controllers/task.controller');

//! middleware validation function
const { validateTaskCreate, validateTaskUpdate } = require('../middlewares/validators/task.validator');
const { isAuth } = require('../middlewares/auth.middleware');

//! basic CRUD routes
router.post('/', isAuth, validateTaskCreate, createTask);
router.get('/', isAuth, getTasks);
router.get('/:id', isAuth, getTask);
router.put('/:id', isAuth, validateTaskUpdate, updateTask);
router.delete('/:id', isAuth, deleteTask);

module.exports = router;