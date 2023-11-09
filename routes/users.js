import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} from '../controllers/users.js';

const usersRouter = new Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateUserAvatar);

export default usersRouter;
