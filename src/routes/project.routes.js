const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, updateProject, deleteProject } = require('../controllers/project.controller');

//! middleware validation function
const { validateProjectCreate, validateProjectUpdate } = require('../middlewares/validators/project.validator');
const { isAuth } = require('../middlewares/auth.middleware');

//! basic CRUD routes
router.post('/', isAuth, validateProjectCreate, createProject);
router.get('/', isAuth, getProjects);
router.get('/:id', isAuth, getProject);
router.put('/:id', isAuth, updateProject);
router.delete('/:id', isAuth, deleteProject);

module.exports = router;