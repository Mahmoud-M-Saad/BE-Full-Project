const dotenv = require("dotenv");
dotenv.config();

const config = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET,
  mode: process.env.MODE || 'development',
  db: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
};

module.exports = config;
