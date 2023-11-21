import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

const { JWT_SECRET, NODE_ENV } = process.env;

const auth = (req, res, next) => {
  let payload;

  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Error('NotAuthenticate');
    }

    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'dev-secret-key');
  } catch (error) {
    if (error.message === 'NotAuthenticate') {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: 'Необходима авторизация',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: 'С токеном что-то не так',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: 'Срок действия токена истек',
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      // error: error.message,
    });
  }

  req.user = payload;

  return next();
};

export default auth;
