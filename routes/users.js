import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} from '../controllers/users.js';

const usersRouter = new Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.get('/me', getUserById);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateUserAvatar);

export default usersRouter;
