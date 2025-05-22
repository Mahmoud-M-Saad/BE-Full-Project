//! External packages
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./src/utils/swagger_output.json');

//! Internal packages
const config = require('./config/config');
const db = require('./src/models');
const routes = require('./src/routes');

const app = express();

//! Global middlewares
app.use(cors());
app.use(express.json());

//! Swagger Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

//! Mount all routes
app.use('/v1', routes);

//! Sync DB
db.sequelize
  .sync({ force: false }) // Use { force: true } to drop all tables and recreate them but false do nothing
  .then(() => { console.log('✅ Database synced') })
  .catch((err) => { console.error('❌ Error syncing database:', err) });

//! Start server
app.listen(config.port, () => {
  console.log(`🚀🚀 Server is running on port ${config.port}`);
});
