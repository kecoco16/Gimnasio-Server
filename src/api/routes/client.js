// DataBase.
import db from '../db'

// Schemas validates.
import {
  createOrUpdateClientValidate,
  getClientByIdValidate,
  getClientByNameValidate
} from '../validators/client'

// Debug.
const debug = require('debug')('api:client')

const clientRoutes = async router => {
  const { client } = await db.get()

  router.post('/api/createOrUpdateClient', async (req, res, next) => {
    debug('A request has come to /api/createOrUpdateClient')
    const { error } = createOrUpdateClientValidate(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    let Client = []
    try {
      Client = await client.createOrUpdate(req.body)
    } catch (err) {
      return next(err)
    }
    res.send(Client)
  })

  router.get('/api/getClients', async (req, res, next) => {
    debug('A request has come to /api/getClients')
    let Clients = []
    try {
      Clients = await client.findAll()
    } catch (err) {
      return next(err)
    }
    res.send(Clients)
  })

  router.get('/api/getClient/:id', async (req, res, next) => {
    debug('A request has come to /api/getClient/:id')
    const { error } = getClientByIdValidate(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    const { id } = req.params
    let Client = []
    try {
      Client = await client.findById(id)
    } catch (e) {
      return next(e)
    }
    res.send(Client)
  })

  router.get('/api/searchClient/:name', async (req, res, next) => {
    debug('A request has come to /api/searchClient/:name')
    const { error } = getClientByNameValidate(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    const { name } = req.params
    let Client = []
    try {
      Client = await client.findByName(name)
    } catch (e) {
      return next(e)
    }
    res.send(Client)
  })

  router.get('/api/getLateClients', async (req, res, next) => {
    debug('A request has come to /api/getLateClients')
    let Clients = []
    try {
      Clients = await client.findByPayLate()
    } catch (err) {
      return next(err)
    }
    res.send(Clients)
  })

  router.get('/api/getTodayClients', async (req, res, next) => {
    debug('A request has come to /api/getTodayClients')
    let Clients = []
    try {
      Clients = await client.findByPayToday()
    } catch (err) {
      return next(err)
    }
    res.send(Clients)
  })
}

export default clientRoutes
