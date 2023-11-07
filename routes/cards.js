import { Router } from 'express';
import { createCard, getCards, deleteCard } from '../controllers/cards.js';

const cardsRouter = new Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);

export default cardsRouter;
