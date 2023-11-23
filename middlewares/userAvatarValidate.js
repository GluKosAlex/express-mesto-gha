import { Joi, celebrate } from 'celebrate';
import { URLExpression } from '../utils/constants.js';

export default celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string().required().pattern(new RegExp(URLExpression)),
    })
    .unknown(true),
});
