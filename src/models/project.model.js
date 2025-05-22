module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define('Project', {
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

  return Project;
};
