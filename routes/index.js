import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Router } from 'express';
import usersRouter from './users.js';
import cardsRouter from './cards.js';
import { createUser, login } from '../controllers/users.js';

const router = new Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.post('/signin', login);
router.post('/signup', createUser);
router.use('*', (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .send(`Error: ${StatusCodes.NOT_FOUND} ${req.originalUrl} ${ReasonPhrases.NOT_FOUND}`);
});

export default router;
