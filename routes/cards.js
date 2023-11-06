import { Router } from 'express';

const cardsRouter = new Router();

cardsRouter.get('/', () => {
  console.log('cardsRouter working');
});

export default cardsRouter;
