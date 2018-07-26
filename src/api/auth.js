import jwt from 'jsonwebtoken'

export const sign = (payload, secret) => (
  jwt.sign(payload, secret)
)

export const verify = (token, secret) => (
  jwt.verify(token, secret)
)
