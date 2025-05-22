const express = require('express');
const router = express.Router();
const { createUser, getUser } = require('../controllers/user.controller');

//! middleware validation function
const { authenticate } = require('../middleware/auth.middleware'); 

//! Get routes
router.get('/', getUser);

//! Post routes
router.post('/', authenticate, createUser);

module.exports = router;