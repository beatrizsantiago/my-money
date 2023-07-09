import { Request, Response, NextFunction } from 'express';

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const documentation = require('./swagger_documentation.json');
const routes = require('./routes');
const { authenticateMiddleware: middleware } = require('./utils/middleware');

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = mongoose.connection;

database.on('error', (error: any) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

const app = express();

app.use(cors());
app.use(express.json());

const PUBLIC_ROUTES = [
  '/api-docs',
  '/autenticacao',
  '/usuarios/cadastrar'
];

app.use((req:Request, res:Response, next:NextFunction) => {
  console.log(req.path);
  
  if (PUBLIC_ROUTES.some((route) => req.path.includes(route))) {
    return next();
  }

  middleware(req, res, next);
});

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentation));

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PORT}`);
});