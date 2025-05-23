const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');

//! middleware validation function
const { validateProductCreate, validateProductUpdate } = require('../middlewares/validators/product.validator');

//! basic CRUD routes
router.post('/', validateProductCreate, createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', validateProductUpdate, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;