import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import CustomError from '../utils/customError.js';

const { JWT_SECRET, NODE_ENV } = process.env;

const auth = (req, res, next) => {
  let payload;

  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
    }

    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'dev-secret-key');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new CustomError('С токеном что-то не так', StatusCodes.UNAUTHORIZED));
    }

    if (error.name === 'TokenExpiredError') {
      return next(new CustomError('Срок действия токена истек', StatusCodes.UNAUTHORIZED));
    }

    return next(error);
  }

  req.user = payload;

  return next();
};

export default auth;
