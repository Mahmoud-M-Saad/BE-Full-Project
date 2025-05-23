const productService = require('../services/product.service');
const responseHandler = require('../utils/responseHandler');

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    return responseHandler.created(res, product, "Product created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    return responseHandler.success(res, products);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Get Product by ID
exports.getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return responseHandler.error(res, new Error("Product not found"), 404);
    return responseHandler.success(res, product);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) return responseHandler.error(res, new Error("Product not found"), 404);
    return responseHandler.success(res, product, "Product updated successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    if (!result) return responseHandler.error(res, new Error("Product not found"), 404);
    return responseHandler.success(res, null, "Product deleted successfully.");
  } catch (err) {
    return responseHandler.error(res, err);
  }
};
