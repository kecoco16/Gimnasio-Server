// Dependencies.
import * as Joi from 'joi'

// Schemas
const createOrUpdateUserSchema = Joi.object().keys({
  name: Joi.string().required(),
  password: Joi.string().min(5).required(),
  type: Joi.string().required()
})

const loginSchema = Joi.object().keys({
  name: Joi.string().required(),
  password: Joi.string().min(5).required()
})

const idSchema = Joi.object().keys({
  id: Joi.number().required()
})

// Validates
export const createOrUpdateUserValidate = user => (
  Joi.validate(user, createOrUpdateUserSchema)
)

export const loginValidate = user => (
  Joi.validate(user, loginSchema)
)

export const getUserByIdValidate = userId => (
  Joi.validate(userId, idSchema)
)
