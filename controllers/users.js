import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import User from '../models/user.js';
import { ERROR_CODE_DUPLICATE_MONGO, SALT_ROUNDS } from '../utils/constants.js';
import generateToken from '../utils/jwt.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import CustomError from '../utils/customError.js';

const login = asyncErrorHandler((req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .orFail()
    .then(async (user) => {
      const matched = await bcrypt.compare(String(password), user.password);
      if (!matched) {
        throw new CustomError('Не правильно введен почта/пароль', StatusCodes.UNAUTHORIZED);
      }

      const token = generateToken({ _id: user._id });
      res.send({ token });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new CustomError('Не правильно введен почта/пароль', StatusCodes.UNAUTHORIZED));
      }

      return Promise.reject(error);
    });
});

const getUsers = asyncErrorHandler((req, res) => User.find({}).then((users) => {
  res.send(users);
}));

const getUser = (req, res, next, id) => User.findById(id)
  .orFail()
  .then((user) => res.send(user))
  .catch((error) => {
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return next(
        new CustomError(`Пользователь по указанному ID ${req.params.id} не найден`, StatusCodes.NOT_FOUND),
      );
    }

    if (error instanceof mongoose.Error.CastError) {
      return next(new CustomError('Передан не валидный ID', StatusCodes.BAD_REQUEST));
    }

    return Promise.reject(error);
  });

const getCurrentUser = asyncErrorHandler((req, res, next) => getUser(req, res, next, req.user._id));

const getUserById = asyncErrorHandler((req, res, next) => getUser(req, res, next, req.params.id));

const createUser = asyncErrorHandler((req, res, next) => bcrypt
  .hash(req.body.password, SALT_ROUNDS)
  .then((hash) => User({ ...req.body, password: hash }).save())
  .then((user) => res.status(StatusCodes.CREATED).send(user))
  .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(
        new CustomError('Переданы некорректные данные при создании пользователя', StatusCodes.BAD_REQUEST),
      );
    }

    if (error.code === ERROR_CODE_DUPLICATE_MONGO) {
      return next(
        new CustomError('Пользователь с таким адресом электронной почты уже существует', StatusCodes.CONFLICT),
      );
    }

    return Promise.reject(error);
  }));

const updateUser = (userData, userId, res, next) => User.findByIdAndUpdate(
  userId,
  { ...userData },
  {
    new: true,
    runValidators: true,
  },
)
  .orFail()
  .then((updatedUserInfo) => res.send(updatedUserInfo))
  .catch((error) => {
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return next(
        new CustomError(`Пользователь по указанному ID ${userId} не найден`, StatusCodes.NOT_FOUND),
      );
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return next(
        new CustomError('Переданы некорректные данные при создании пользователя', StatusCodes.BAD_REQUEST),
      );
    }

    return Promise.reject(error);
  });

const updateUserInfo = asyncErrorHandler((req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  updateUser({ name, about }, _id, res, next);
});

const updateUserAvatar = asyncErrorHandler((req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  updateUser({ avatar }, _id, res, next);
});

export {
  login,
  getUsers,
  getCurrentUser,
  getUserById,
  createUser,
  updateUser,
  updateUserInfo,
  updateUserAvatar,
};
