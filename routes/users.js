import { Router } from 'express';
import { createUser, getUser, getUserById } from '../controllers/users.js';

const usersRouter = new Router();

usersRouter.get('/', getUser);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', createUser);

export default usersRouter;
