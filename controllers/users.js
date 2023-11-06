import User from '../models/user.js';
import ERROR_CODE_DUPLICATE_MONGO from '../utils/constants.js';

const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.status(500).send({
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
      throw new Error('Not found');
    }
    return res.send(user);
  } catch (error) {
    if (error.message === 'Not found') {
      return res.status(404).send({
        message: 'Пользователь не найден',
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).send({
        message: 'Передан не валидный ID',
      });
    }

    return res.status(500).send({
      message: 'Ошибка на стороне сервера',
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    return res.status(201).send(await newUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Ошибка валидации полей',
        ...error,
      });
    }

    if (error.code === ERROR_CODE_DUPLICATE_MONGO) {
      return res.status(409).send({
        message: 'Пользователь с таким именем уже существует',
        ...error,
      });
    }
    return res.status(500).send({
      message: error.message,
      error,
    });
  }
};

export { getUser, getUserById, createUser };
