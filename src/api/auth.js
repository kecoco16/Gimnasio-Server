import jwt from 'jsonwebtoken'

export const sign = (payload, secret, cb) => (
  jwt.sign(payload, secret, cb)
)

export const verify = (token, secret, cb) => (
  jwt.verify(token, secret, cb)
)
