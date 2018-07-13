// Dependencies.
import * as Joi from 'joi'

const addClientSchema = Joi.object().keys({
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

const updateClientSchema = Joi.object().keys({
  name: Joi.string(),
  phone: Joi.string().length(8),
  membershipId: Joi.string(),
  email: Joi.string().email(),
  profileImageRoute: Joi.string().required()
})

export const addClientValidate = client => (
  Joi.validate(client, addClientSchema)
)

export const getClientValidate = clientId => (
  Joi.validate(clientId, idSchema)
)

export const searchClientValidate = clientName => (
  Joi.validate(clientName, nameSchema)
)

export const deleteClientValidate = clientId => (
  Joi.validate(clientId, idSchema)
)

export const updateClientValidate = client => (
  Joi.validate(client, updateClientSchema)
)
