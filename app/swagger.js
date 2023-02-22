const swaggerAutogen = require('swagger-autogen')()

const outputFile = './app/swagger_documentation.json';
const endpointsFiles = ['./app/routes/index.js'];

const options = {
  info: {
    title: 'MyMoney API',
    version: '1.0.0',
    description: 'Financial organization project API',
  },
};

swaggerAutogen(
  outputFile,
  endpointsFiles,
  options,
);
