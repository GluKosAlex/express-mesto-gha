import { Joi, celebrate } from 'celebrate';

export default celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
});
