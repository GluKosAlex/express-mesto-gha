import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUserInfo,
} from '../controllers/users.js';

const usersRouter = new Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateUserInfo);

export default usersRouter;
