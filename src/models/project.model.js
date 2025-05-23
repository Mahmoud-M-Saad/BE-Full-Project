module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('Open', 'In Progress', 'Completed', 'Cancelled', 'On Hold', 'Done'),
      defaultValue: 'Open',
    },
  }, {
    tableName: 'projects',
    timestamps: true,
  });
  return Project;
};
