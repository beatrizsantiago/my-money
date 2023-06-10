require('dotenv').config();

const expressModule = require('express');
const mongooseModule = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const documentation = require('./swagger_documentation.json')

const routes = require('./routes');
const mongoString = process.env.DATABASE_URL;

mongooseModule.connect(mongoString);
const database = mongooseModule.connection;

database.on('error', (error: any) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

const app = expressModule();

app.use(expressModule.json());
app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentation));

app.listen(3001, () => {
  console.log(`Server Started at ${3001}`)
});