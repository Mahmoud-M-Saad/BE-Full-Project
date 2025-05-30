const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../services/product.service');
const responseHandler = require('../utils/responseHandler');

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.writeProducts){
      return responseHandler.error(res, new Error("You do not have permission to create a product. Ask your Admin."), 403);
    }
    const product = await createProduct(req.body);
    return responseHandler.created(res, product, "Product created successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.readProducts){
      return responseHandler.error(res, new Error("You do not have permission to read products. Ask your Admin."), 403);
    }
    const products = await getProducts();
    return responseHandler.success(res, products);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Get Product by ID
exports.getProduct = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.readProducts){
      return responseHandler.error(res, new Error("You do not have permission to read a product. Ask your Admin."), 403);
    }
    const product = await getProductById(req.params.id);
    if (!product) return responseHandler.error(res, new Error("Product not found"), 404);
    return responseHandler.success(res, product);
  } catch (err) {
    return responseHandler.error(res, err);
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.writeProducts){
      return responseHandler.error(res, new Error("You do not have permission to update a product. Ask your Admin."), 403);
    }
    const product = await updateProduct(req.params.id, {price: req.body.price,  description: req.body.description});
    if (!product) return responseHandler.error(res, new Error("Product not found"), 404);
    return responseHandler.success(res, product, "Product updated successfully.");
  } catch (err) {
    return responseHandler.error(res, err, 400);
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const userPermission = req.user.permissions;
    if(!userPermission.writeProducts){
      return responseHandler.error(res, new Error("You do not have permission to delete a product. Ask your Admin."), 403);
    }
    const result = await deleteProduct(req.params.id);
    if (!result) return responseHandler.error(res, new Error("Product not found"), 404);
    return responseHandler.success(res, null, "Product deleted successfully.");
  } catch (err) {
    return responseHandler.error(res, err);
  }
};
