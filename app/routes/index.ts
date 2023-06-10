const { Router } = require('express');
const expensesRouter = require('./expenses');
const categoriesRouter = require('./categories');
const tagsRouter = require('./tags');

const apiRouter = Router();

apiRouter.use('/despesas', expensesRouter);
apiRouter.use('/categorias', categoriesRouter);
apiRouter.use('/tags', tagsRouter);

module.exports = apiRouter;
