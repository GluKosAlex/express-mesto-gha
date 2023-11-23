import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import Card from '../models/card.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import CustomError from '../utils/customError.js';

// Get all cards controller
// eslint-disable-next-line no-unused-vars
const getCards = asyncErrorHandler((req, res, next) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => {
    res.send(cards);
  }));

// Create card controller
const createCard = asyncErrorHandler((req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  return Card({ name, link, owner: _id })
    .save()
    .then((card) => res.status(StatusCodes.CREATED).send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(
          new CustomError('Переданы некорректные данные при создании карточки', StatusCodes.BAD_REQUEST),
        );
      }

      return Promise.reject(error);
    });
});

// Delete card controller
const deleteCard = asyncErrorHandler((req, res, next) => {
  const { cardId } = req.params;

  return Card.findOneAndDelete({ _id: cardId, owner: req.user._id })
    .orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new CustomError('Нельзя удалять карточки других пользователей', StatusCodes.NOT_FOUND));
      }

      if (error instanceof mongoose.Error.CastError) {
        return next(new CustomError('Передан не валидный ID', StatusCodes.BAD_REQUEST));
      }

      return Promise.reject(error);
    });
});

// Toggle like card controller
const toggleCardLike = (action, req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(cardId, { [action]: { likes: _id } }, { new: true })
    .populate('likes')
    .orFail()
    .then((updatedCard) => res.send(updatedCard))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(
          new CustomError(`Передан несуществующий ID ${req.params.cardId} карточки`, StatusCodes.NOT_FOUND),
        );
      }

      if (error instanceof mongoose.Error.CastError) {
        return next(
          new CustomError('Переданы некорректные данные для постановки/снятии лайка', StatusCodes.BAD_REQUEST),
        );
      }

      return Promise.reject(error);
    });
};

// Add like card decorator
const putCardLike = asyncErrorHandler((req, res, next) => toggleCardLike('$addToSet', req, res, next));

// Delete like card decorator
const deleteCardLike = asyncErrorHandler((req, res, next) => toggleCardLike('$pull', req, res, next));

export {
  createCard,
  getCards,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
