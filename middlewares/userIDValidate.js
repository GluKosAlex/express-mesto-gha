import { Joi, celebrate } from 'celebrate';

export default celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
});
