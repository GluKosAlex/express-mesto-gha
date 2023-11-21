import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import User from '../models/user.js';
import { ERROR_CODE_DUPLICATE_MONGO, SALT_ROUNDS } from '../utils/constants.js';
import generateToken from '../utils/jwt.js';

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail()
    .then(async (user) => {
      const matched = await bcrypt.compare(String(password), user.password);
      if (!matched) {
        throw new Error('NotAuthenticate');
      }

      const token = generateToken({ _id: user._id });
      res.send({ token });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError || error.message === 'NotAuthenticate') {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          message: 'Не правильно введен почта/пароль',
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка на стороне сервера',
        // error: error.message,
      });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка на стороне сервера',
        error: error.message,
      });
    });
};

const getUser = (req, res, id) => {
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).send({
          message: `Пользователь по указанному ID ${req.params.id} не найден`,
        });
      }

      if (error instanceof mongoose.Error.CastError) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Передан не валидный ID',
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка на стороне сервера',
        error: error.message,
      });
    });
};

const getCurrentUser = (req, res) => {
  getUser(req, res, req.user._id);
};

const getUserById = (req, res) => {
  getUser(req, res, req.params.id);
};

const createUser = (req, res) => {
  bcrypt
    .hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User({ ...req.body, password: hash }).save())
    .then((user) => res.status(StatusCodes.CREATED).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }

      if (error.code === ERROR_CODE_DUPLICATE_MONGO) {
        return res.status(StatusCodes.CONFLICT).send({
          message: 'Пользователь с таким адресом электронной почты уже существует',
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка на стороне сервера',
        error: error.message,
      });
    });
};

const updateUser = (userData, userId, res) => {
  User.findByIdAndUpdate(
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
        return res.status(StatusCodes.NOT_FOUND).send({
          message: `Пользователь по указанному ID ${userId} не найден.`,
        });
      }

      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка на стороне сервера',
        error: error.message,
      });
    });
};

const updateUserInfo = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  updateUser({ name, about }, _id, res);
};

const updateUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  updateUser({ avatar }, _id, res);
};

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
