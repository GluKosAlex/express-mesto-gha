import Card from '../models/card.js';

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
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

const putCardLike = async (req, res) => {
  try {
    const { _id } = req.user;
    const { cardId } = req.params;
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    ).populate('likes');
    return res.send(updatedCard);
  } catch (error) {
    return res.status(500).send({
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
    return res.send(updatedCard);
  } catch (error) {
    return res.status(500).send({
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
