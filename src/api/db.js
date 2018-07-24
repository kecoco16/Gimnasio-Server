// Database.
import { dbConfig } from '../commond/setup'
const db = require('../db')

// Dependencies.
const debug = require('debug')('api')

const run = async () => {
  if (!services) {
    try {
      const connect = await db(dbConfig(debug))
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
