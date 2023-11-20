import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: (v) => isEmail(v),
        message: (props) => `${props.value} не валидный адрес электронной почты!`,
      },
      required: [true, 'Поле с адресом электронной почты является обязательным'],
    },
    password: {
      type: String,
      required: [true, 'Поле с паролем является обязательным'],
    },
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
