const dotenv = require("dotenv");
dotenv.config();
const { PORT, JWT_SECRET, MODE, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_TYPE, DB_SSL } = process.env;

const config = {
  port: PORT || 5001,
  jwtSecret: JWT_SECRET,
  mode: MODE || 'development',
  db: {
    url: `${DB_TYPE}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}`,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST || 'localhost',
    dialect: DB_TYPE || 'postgres',
    ssl: DB_SSL === 'true'? {require: true, rejectUnauthorized: false} : "",
  },
};

module.exports = config;
