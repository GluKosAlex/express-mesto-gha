import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: {
      value: true,
      message: 'Поле с именем пользователя является обязательным',
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
  about: {
    type: String,
    require: {
      value: true,
      message: 'Поле с информацией о пользователе является обязательным',
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
  avatar: {
    type: String,
    require: {
      value: true,
      message: 'Поле с ссылкой на аватарку является обязательным',
    },
  },
});

export default mongoose.model('user', userSchema);
