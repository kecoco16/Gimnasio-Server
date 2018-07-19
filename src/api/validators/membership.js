// Dependencies.
import * as Joi from 'joi'

// Schemas
const createOrUpdateMembershipSchema = Joi.object().keys({
  name: Joi.string().required(),
  amount: Joi.number().required()
})

const idSchema = Joi.object().keys({
  id: Joi.number().required()
})

// Validates
export const createOrUpdateMembershipValidate = membership => (
  Joi.validate(membership, createOrUpdateMembershipSchema)
)

export const getMembershipByIdValidate = membershipId => (
  Joi.validate(membershipId, idSchema)
)
