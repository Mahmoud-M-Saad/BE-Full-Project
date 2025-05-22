const swaggerAutogen = require('swagger-autogen')();
const config = require('./config');

const doc = {
  info: {
    title: 'Your API Title',
    description: 'Auto-generated Swagger doc',
  },
  host: config.host || 'localhost:5000',
  schemes: ['http'],
};

const outputFile = '../src/utils/swagger_output.json';
const endpointsFiles = ['./app.js']; // change this to your main server file or add all route files

swaggerAutogen(outputFile, endpointsFiles, doc);
