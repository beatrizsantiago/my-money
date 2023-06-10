const { Router } = require('express');
const expensesRouter = require('./expenses');
const categoriesRouter = require('./categories');

const apiRouter = Router();

apiRouter.use('/despesas', expensesRouter);
apiRouter.use('/categorias', categoriesRouter);

module.exports = apiRouter;
