import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import User from '../models/user.js';
import ERROR_CODE_DUPLICATE_MONGO from '../utils/constants.js';

const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new Error(ReasonPhrases.NOT_FOUND);
    }
    return res.send(user);
  } catch (error) {
    if (error.message === ReasonPhrases.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).send({
        message: `Пользователь по указанному ID ${req.params.id} не найден.`,
      });
    }

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Передан не валидный ID',
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    return res.status(StatusCodes.CREATED).send(await newUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании пользователя.',
      });
    }

    if (error.code === ERROR_CODE_DUPLICATE_MONGO) {
      return res.status(StatusCodes.CONFLICT).send({
        message: 'Пользователь с таким именем уже существует',
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      error: error.message,
    });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { _id } = req.user;
    const updatedUserInfo = await User.findByIdAndUpdate(
      _id,
      { ...req.body },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUserInfo) {
      throw new Error(ReasonPhrases.NOT_FOUND);
    }

    // const error = updatedUserInfo.validateSync();
    // if (error) {
    //   throw new Error(error.name);
    // }

    return res.send(updatedUserInfo);
  } catch (error) {
    if (error.message === ReasonPhrases.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).send({
        message: `Пользователь по указанному ID ${req.user._id} не найден.`,
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании пользователя.',
      });
    }

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Передан не валидный ID',
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      error: error.name,
    });
  }
};

export {
  getUser,
  getUserById,
  createUser,
  updateUserInfo,
};
