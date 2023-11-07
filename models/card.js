import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле с именем карточки является обязательным'],
      minlength: [2, 'Минимальная длина строки 2 символа'],
      maxlength: [30, 'Минимальная длина строки 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'Поле с ссылкой на картинку является обязательным'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false },
);

export default mongoose.model('card', cardSchema);
