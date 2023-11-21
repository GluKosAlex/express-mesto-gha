import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: (v) => isEmail(v),
        message: (props) => `${props.value} не валидный адрес электронной почты!`,
      },
      required: [true, 'Поле с адресом электронной почты является обязательным'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Поле с паролем является обязательным'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Поле с именем пользователя является обязательным'],
      minlength: [2, 'Минимальная длина строки 2 символа'],
      maxlength: [30, 'Минимальная длина строки 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      required: [true, 'Поле с информацией о пользователе является обязательным'],
      minlength: [2, 'Минимальная длина строки 2 символа'],
      maxlength: [30, 'Минимальная длина строки 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      required: [true, 'Поле с ссылкой на аватарку является обязательным'],
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  { versionKey: false },
);

export default mongoose.model('user', userSchema);
