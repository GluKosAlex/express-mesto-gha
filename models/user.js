import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле с именем пользователя является обязательным'],
      minlength: [2, 'Минимальная длина строки 2 символа'],
      maxlength: [30, 'Минимальная длина строки 30 символов'],
    },
    about: {
      type: String,
      required: [true, 'Поле с информацией о пользователе является обязательным'],
      minlength: [2, 'Минимальная длина строки 2 символа'],
      maxlength: [30, 'Минимальная длина строки 30 символов'],
    },
    avatar: {
      type: String,
      required: [true, 'Поле с ссылкой на аватарку является обязательным'],
    },
  },
  { versionKey: false },
);

export default mongoose.model('user', userSchema);
