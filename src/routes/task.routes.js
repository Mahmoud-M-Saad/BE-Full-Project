const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTask, updateTask, deleteTask } = require('../controllers/task.controller');

//! middleware validation function
const { validateTaskCreate, validateTaskUpdate } = require('../middlewares/validators/task.validator');

//! basic CRUD routes
router.post('/', validateTaskCreate, createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', validateTaskUpdate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;