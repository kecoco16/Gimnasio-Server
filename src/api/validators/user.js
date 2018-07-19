// Dependencies.
import * as Joi from 'joi'

// Schemas
const createOrUpdateUserSchema = Joi.object().keys({
  name: Joi.string().required(),
  password: Joi.string().min(5).required(),
  type: Joi.string().required()
})

const idSchema = Joi.object().keys({
  id: Joi.number().required()
})

// Validates
export const createOrUpdateUserValidate = user => (
  Joi.validate(user, createOrUpdateUserSchema)
)

export const getUserByIdValidate = userId => (
  Joi.validate(userId, idSchema)
)
