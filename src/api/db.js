// Dependencies.
const debug = require('debug')('api')

// Database.
const db = require('../db')

const config = {
  database: process.env.DB_NAME || 'gimnasio',
  username: process.env.DB_USER || 'coco',
  password: process.env.DB_PASS || 'coco',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,
  logging: s => debug(s)
}

let services

const run = async () => {
  if (!services) {
    try {
      const { client, membership, user, payment } = await db(config)
      debug('Database connection')
      return {
        client,
        membership,
        user,
        payment
      }
    } catch (e) {
      debug(e)
    }
  }
}

export default run
