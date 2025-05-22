module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define('Task', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.ENUM('Open', 'In Progress', 'Completed', 'Cancelled', 'On Hold', 'Done'),
      defaultValue: 'Open',
    },
  });

  return Task;
};
