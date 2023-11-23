import { Joi, celebrate } from 'celebrate';
import { URLExpression } from '../utils/constants.js';

export default celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(new RegExp(URLExpression)),
    }),
});
