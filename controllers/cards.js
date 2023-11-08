import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import Card from '../models/card.js';

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.send(cards);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      error: error.message,
    });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const { _id } = req.user;
    const newCard = new Card({ name, link, owner: _id });
    return res.status(StatusCodes.CREATED).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании карточки.',
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      error: error.message,
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      throw new Error(ReasonPhrases.NOT_FOUND);
    }
    return res.send(card);
  } catch (error) {
    if (error.message === ReasonPhrases.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).send({
        message: `Карточка с указанным ID ${req.params.cardId} не найдена.`,
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      error: error.message,
    });
  }
};

const putCardLike = async (req, res) => {
  try {
    const { _id } = req.user;
    const { cardId } = req.params;
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    ).populate('likes');
    if (!updatedCard) {
      throw new Error(ReasonPhrases.NOT_FOUND);
    }
    return res.send(updatedCard);
  } catch (error) {
    if (error.message === ReasonPhrases.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).send({
        message: `Передан несуществующий ID ${req.params.cardId} карточки.`,
      });
    }

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Переданы некорректные данные для постановки лайка.',
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      error: error.message,
    });
  }
};

const deleteCardLike = async (req, res) => {
  try {
    const { _id } = req.user;
    const { cardId } = req.params;
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: _id } },
      { new: true },
    ).populate('likes');
    if (!updatedCard) {
      throw new Error(ReasonPhrases.NOT_FOUND);
    }
    return res.send(updatedCard);
  } catch (error) {
    if (error.message === ReasonPhrases.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).send({
        message: `Передан несуществующий ID ${req.params.cardId} карточки.`,
      });
    }

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Переданы некорректные данные снятии лайка.',
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      error: error.message,
    });
  }
};

export {
  createCard,
  getCards,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
