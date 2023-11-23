import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Router } from 'express';
import globalErrorHandler from '../controllers/errors.js';

import usersRouter from './users.js';
import cardsRouter from './cards.js';
import { createUser, login } from '../controllers/users.js';
import auth from '../middlewares/auth.js';
import CustomError from '../utils/customError.js';

const router = new Router();

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.post('/signin', login);
router.post('/signup', createUser);
router.use('*', auth, (req, res, next) => {
  const err = new CustomError(
    `Error: ${StatusCodes.NOT_FOUND} ${req.originalUrl} ${ReasonPhrases.NOT_FOUND}`,
    StatusCodes.NOT_FOUND,
  );
  next(err);
});

router.use(globalErrorHandler);

export default router;
