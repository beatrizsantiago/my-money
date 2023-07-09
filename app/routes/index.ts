const { Router } = require('express');

const expensesRouter = require('./expenses');
const categoriesRouter = require('./categories');
const tagsRouter = require('./tags');
const usersRouter = require('./users');
const authRouter = require('./auth');

const apiRouter = Router();

apiRouter.use('/autenticacao', authRouter);
apiRouter.use('/despesas', expensesRouter);
apiRouter.use('/categorias', categoriesRouter);
apiRouter.use('/tags', tagsRouter);
apiRouter.use('/usuarios', usersRouter);

module.exports = apiRouter;
