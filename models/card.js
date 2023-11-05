import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    require: {
      value: true,
      message: 'Поле с именем карточки является обязательным',
    },
    minlength: {
      value: 2,
      message: 'Минимальная длина строки 2 символа',
    },
    maxlength: {
      value: 30,
      message: 'Минимальная длина строки 30 символов',
    },
  },
  link: {
    type: String,
    require: {
      value: true,
      message: 'Поле с ссылкой на картинку является обязательным',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'name',
    require: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'name',
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model('card', cardSchema);
