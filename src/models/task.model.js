module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
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
    tableName: 'tasks',
    timestamps: true
  });
  return Task;
};
