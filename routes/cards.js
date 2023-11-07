import { Router } from 'express';
import {
  createCard,
  getCards,
  deleteCard,
  putCardLike,
  deleteCardLike,
} from '../controllers/cards.js';

const cardsRouter = new Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', putCardLike);
cardsRouter.delete('/:cardId/likes', deleteCardLike);

export default cardsRouter;
