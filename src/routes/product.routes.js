const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');

//! middleware validation function
const { validateProductCreate, validateProductUpdate } = require('../middlewares/validators/product.validator');
const { isAuth } = require('../middlewares/auth.middleware');

//! basic CRUD routes
router.post('/', isAuth, validateProductCreate, createProduct);
router.get('/', isAuth, getProducts);
router.get('/:id', isAuth, getProduct);
router.put('/:id', isAuth, validateProductUpdate, updateProduct);
router.delete('/:id', isAuth, deleteProduct);

module.exports = router;