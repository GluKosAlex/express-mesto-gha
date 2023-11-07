import Card from '../models/card.js';

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate('owner');
    return res.send(cards);
  } catch (error) {
    return res.status(500).send({
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
    return res.status(201).send(await newCard.save());
  } catch (error) {
    return res.status(500).send({
      message: 'Ошибка на стороне сервера',
      error: error.message,
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);
    return res.send(card);
  } catch (error) {
    return res.status(500).send({
      message: 'Ошибка на стороне сервера',
      error: error.message,
    });
  }
};

export { getCards, createCard, deleteCard };
