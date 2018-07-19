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

const run = async () => {
  if (!services) {
    try {
      const connect = await db(config)
      debug('Database connection')
      return connect
    } catch (e) {
      debug(e)
    }
  }
}

const services = run()

const get = async () => {
  return services
}

export default {
  run,
  get
}
