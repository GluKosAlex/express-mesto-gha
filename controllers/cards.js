import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import Card from '../models/card.js';

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка на стороне сервера',
        error: error.message,
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card({ name, link, owner: _id })
    .save()
    .then((card) => res.status(StatusCodes.CREATED).send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка на стороне сервера',
        error: error.message,
      });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).send({
          message: `Карточка по указанному ID ${req.user._id} не найдена.`,
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

const putCardLike = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .populate('likes')
    .orFail()
    .then((updatedCard) => res.send(updatedCard))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).send({
          message: `Передан несуществующий ID ${req.params.cardId} карточки.`,
        });
      }

      if (error instanceof mongoose.Error.CastError) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка на стороне сервера',
        error: error.message,
      });
    });
};

const deleteCardLike = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .populate('likes')
    .orFail()
    .then((updatedCard) => res.send(updatedCard))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).send({
          message: `Передан несуществующий ID ${req.params.cardId} карточки.`,
        });
      }

      if (error instanceof mongoose.Error.CastError) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Переданы некорректные данные для снятии лайка.',
        });
      }

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка на стороне сервера',
        error: error.message,
      });
    });
};

export {
  createCard,
  getCards,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
