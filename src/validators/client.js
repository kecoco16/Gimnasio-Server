import * as Joi from 'joi'

const addClientSchema = Joi.object().keys({
  nombre: Joi.string().required(),
  cedula: Joi.string().length(9).required(),
  telefono: Joi.string().length(8).required(),
  mensualidad: Joi.string().required(),
  correo: Joi.string().email().required(),
  sexo: Joi.string().length(1).required(),
  imagen: Joi.string().required(),
  hoy: Joi.date().required(),
  pago: Joi.date().required()
})

const idSchema = Joi.object().keys({
  id: Joi.number().required()
})

const updateClientSchema = Joi.object().keys({
  nombre: Joi.string(),
  telefono: Joi.string().length(8),
  mensualidad: Joi.string(),
  correo: Joi.string().email(),
  imagen: Joi.string()
})

export const addClientValidate = client => (
  Joi.validate(client, addClientSchema)
)

export const getClientValidate = clientId => (
  Joi.validate(clientId, idSchema)
)

export const deleteClientValidate = clientId => (
  Joi.validate(clientId, idSchema)
)

export const updateClientValidate = client => (
  Joi.validate(client, updateClientSchema)
)
