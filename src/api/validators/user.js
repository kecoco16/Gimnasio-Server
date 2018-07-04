import * as Joi from 'joi'

const addUserSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().min(5).required(),
  type: Joi.string().required()
})

export const addUserValidate = user => (
  Joi.validate(user, addUserSchema)
)