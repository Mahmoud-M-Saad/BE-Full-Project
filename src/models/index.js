const Sequelize = require('sequelize');
const config = require('../../config/config');
const fs = require('fs');
const path = require('path');
const { url, dialect, ssl } = config.db;

const sequelize = new Sequelize(url, {
    dialect,
    protocol: 'postgres',
    dialectOptions: { ssl },
    logging: false,
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//! Dynamically load all models in this directory ending with .model.js
const basename = path.basename(__filename);
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.model.js') && file !== basename)
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // const modelName = model.name || path.basename(file, '.model.js');
    // db[modelName.charAt(0).toUpperCase() + modelName.slice(1)] = model;
    db[model.name] = model;
  });

// Associations

// Staff <-> Project (Many-to-Many)
db.Staff && db.Project && db.Staff.belongsToMany(db.Project, { through: 'StaffProjects', foreignKey: 'staffId', otherKey: 'projectId', as: 'projects' });
db.Project && db.Staff && db.Project.belongsToMany(db.Staff, { through: 'StaffProjects', foreignKey: 'projectId', otherKey: 'staffId', as: 'users' });

// Project <-> Task (One-to-Many)
db.Project && db.Task && db.Project.hasMany(db.Task, { foreignKey: 'projectId', as: 'tasks' });
db.Task && db.Project && db.Task.belongsTo(db.Project, { foreignKey: 'projectId', as: 'project' });

// Staff and Permission <-> User (One-to-One)
db.Staff && db.User && db.Staff.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
db.Permission && db.User && db.Permission.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

module.exports = db;
