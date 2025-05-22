module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define('Product', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
    },
  });

  return Product;
};
