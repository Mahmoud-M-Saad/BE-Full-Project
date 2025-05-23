const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'your_db_name',
  process.env.DB_USER || 'your_db_user',
  process.env.DB_PASSWORD || 'your_db_password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql', // or 'postgres', 'sqlite', etc.
    logging: false,
  }
);

module.exports = sequelize;