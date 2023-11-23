import { Router } from 'express';
import {
  createCard,
  getCards,
  deleteCard,
  putCardLike,
  deleteCardLike,
} from '../controllers/cards.js';
import cardInfoValidate from '../middlewares/cardInfoValidate.js';
import cardIDValidate from '../middlewares/cardIDValidate.js';

const cardsRouter = new Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', cardInfoValidate, createCard);
cardsRouter.delete('/:cardId', cardIDValidate, deleteCard);
cardsRouter.put('/:cardId/likes', cardIDValidate, putCardLike);
cardsRouter.delete('/:cardId/likes', cardIDValidate, deleteCardLike);

export default cardsRouter;
