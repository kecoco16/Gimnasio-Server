// Dependencies.
import * as Joi from 'joi'

// Schemas
const createPaymentSchema = Joi.object().keys({
  amount: Joi.number().required(),
  clientId: Joi.string().required(),
  userId: Joi.string().required()
})

const paymentsByDateSchema = Joi.object().keys({
  from: Joi.date().required(),
  to: Joi.date().required()
})

// Validates
export const createPaymentValidate = payment => (
  Joi.validate(payment, createPaymentSchema)
)

export const searchPaymentsByDates = dates => (
  Joi.validate(dates, paymentsByDateSchema)
)
