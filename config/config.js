const dotenv = require("dotenv");
dotenv.config();
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_TYPE, DB_SSL } = process.env;
const { PORT, JWT_SECRET, MODE, JWT_ENCRYPTION_KEY, JWT_ALGORITHM_KEY } = process.env;
const { EMAIL_USER, EMAIL_PASS, FRONTEND_LINK } = process.env;

const config = {
  port: PORT || 5001,
  jwtSecret: JWT_SECRET,
  jwtEncryptionKey: JWT_ENCRYPTION_KEY,
  jwtAlgorithmKey: JWT_ALGORITHM_KEY,
  mode: MODE || 'development',
  frontEndLink: FRONTEND_LINK,
  email: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  },
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
