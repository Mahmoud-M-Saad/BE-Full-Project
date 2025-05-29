module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    readAdmins: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    writeAdmins: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readEmployees: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    writeEmployees: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readProjects: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    writeProjects: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,  
    },
    readTasks: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    writeTasks: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readProducts: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    writeProducts: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'employee'),
      defaultValue: 'employee',
    },
  }, {
    tableName: 'permissions',
    timestamps: true
  });
  return Permission;
};
