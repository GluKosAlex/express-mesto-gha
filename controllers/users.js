import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.js';

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

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).send({
          message: `Пользователь по указанному ID ${req.params.id} не найден.`,
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

const createUser = (req, res) => {
  User(req.body)
    .save()
    .then((user) => res.status(StatusCodes.CREATED).send(user))
    .catch((error) => {
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
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
