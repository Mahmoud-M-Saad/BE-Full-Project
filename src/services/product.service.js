const db = require('../models');
const Product = db.Product;

exports.createProduct = async (productData) => {
    try {
        const product = await Product.create(productData);
        if (!product) return { error: 'Product creation failed' };
        return product;
    } catch (error) {
        return { error: error.message };
    }
};

exports.getProducts = async () => {
    try {
        const products = await Product.findAll();
        if (!products) return { error: 'No products found' };
        return products;
    } catch (error) {
        return { error: error.message };
    }
};

exports.getProductById = async (id) => {
    try {
        const product = await Product.findByPk(id);
        if (!product) return { error: 'Product not found' };
        return product;
    } catch (error) {
        return { error: error.message };
    }
};

exports.updateProduct = async (id, productData) => {
    try {
        const updated = await Product.update(productData, { where: { id } });
        if (!updated[0]) return { error: 'Product not found' };
        const product = await Product.findByPk(id);
        return product;
    } catch (error) {
        return { error: error.message };
    }
};

exports.deleteProduct = async (id) => {
    try {
        const deleted = await Product.destroy({ where: { id } });
        if (!deleted) return { error: 'Product not found' };
        return { message: 'Product deleted successfully' };
    } catch (error) {
        return { error: error.message };
    }
};