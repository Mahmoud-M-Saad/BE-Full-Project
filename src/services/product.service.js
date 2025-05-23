const db = require('../models');
const Product = db.Product;

exports.createProduct = async (productData) => {
    return await Product.create(productData);
};

exports.getProducts = async () => {
    return await Product.findAll();
};

exports.getProductById = async (id) => {
    return await Product.findByPk(id);
};

exports.updateProduct = async (id, productData) => {
    await Product.update(productData, { where: { id } });
    return await Product.findByPk(id);
};

exports.deleteProduct = async (id) => {
    return await Product.destroy({ where: { id } });
};