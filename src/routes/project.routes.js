const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, updateProject, deleteProject } = require('../controllers/project.controller');

//! middleware validation function
const { validateProjectCreate, validateProjectUpdate } = require('../middlewares/validators/project.validator');

//! basic CRUD routes
router.post('/', validateProjectCreate, createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', validateProjectUpdate, updateProject);
router.delete('/:id', deleteProject);

module.exports = router;