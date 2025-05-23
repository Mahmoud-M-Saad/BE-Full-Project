module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'employee', 'customer', 'guest'),
      defaultValue: 'guest',
    },
  }, {
    tableName: 'users',
    timestamps: true
  });
  return User;
};
