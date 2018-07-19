// Dependencies.
import * as Joi from 'joi'

// Schemas
const createOrUpdateClientSchema = Joi.object().keys({
  idNumber: Joi.string().length(9).required(),
  name: Joi.string().required(),
  gender: Joi.string().length(1).required(),
  phone: Joi.string().length(8).required(),
  email: Joi.string().email(),
  profileImageRoute: Joi.string().required(),
  payDay: Joi.date().required(),
  membershipId: Joi.string().required()
})

const idSchema = Joi.object().keys({
  id: Joi.number().required()
})

const nameSchema = Joi.object().keys({
  name: Joi.string().required()
})

// Validates
export const createOrUpdateClientValidate = client => (
  Joi.validate(client, createOrUpdateClientSchema)
)

export const getClientByIdValidate = clientId => (
  Joi.validate(clientId, idSchema)
)

export const getClientByNameValidate = clientName => (
  Joi.validate(clientName, nameSchema)
)
