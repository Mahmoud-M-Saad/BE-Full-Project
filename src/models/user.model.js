module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    role: {
      type: Sequelize.ENUM('super_admin', 'admin', 'employee', 'customer', 'guest'),
      defaultValue: 'guest',
    },
  });

  return User;
};
