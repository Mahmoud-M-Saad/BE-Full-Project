const db = require('../models');
const User = db.User;

// Create User
exports.createUser = async (userData) => {
  return await User.create(userData);
};

// Get All Users
exports.getUsers = async () => {
  return await User.findAll();
};

// Get User by ID
exports.getUserById = async (id) => {
  return await User.findByPk(id);
};

// Update User
exports.updateUser = async (id, userData) => {
  await User.update(userData, { where: { id } });
  return await User.findByPk(id);
};

// Delete User
exports.deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};
