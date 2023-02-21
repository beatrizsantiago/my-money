const { Router } = require('express');
const expensesRouter = require('./expenses');

const apiRouter = Router();

apiRouter.use('/despesas', expensesRouter);

module.exports = apiRouter;