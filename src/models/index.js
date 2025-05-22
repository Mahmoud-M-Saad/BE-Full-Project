const Sequelize = require('sequelize');
const config = require('../../config/config');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: false, // Set to console.log for debugging
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//! Dynamically load all models in this directory ending with .model.js
const basename = path.basename(__filename);
fs.readdirSync(__dirname)
  .filter(
    (file) => file.endsWith('.model.js') && file !== basename
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    const modelName = model.name || path.basename(file, '.model.js');
    db[modelName.charAt(0).toUpperCase() + modelName.slice(1)] = model;
  });

// Define associations (example)
db.Project && db.User && db.Project.belongsTo(db.User, { foreignKey: 'userId', as: 'owner' });
db.Task && db.Project && db.Task.belongsTo(db.Project, { foreignKey: 'projectId' });

module.exports = db;
