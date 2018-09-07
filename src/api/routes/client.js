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

    try {
      const Client = await client.createOrUpdate(req.body)
      res.send(Client)
    } catch (err) {
      return next(err)
    }
  })

  router.post('/api/deleteClient', async (req, res, next) => {
    debug('A request has come to /api/deleteClient')
    const { error } = getClientByIdValidate(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    try {
      await client.deleteClient(req.body.id)
      res.send({ message: 'Success!' })
    } catch (err) {
      return next(err)
    }
  })

  router.get('/api/getClients', async (req, res, next) => {
    debug('A request has come to /api/getClients')
    try {
      const Clients = await client.findAll()
      res.send(Clients)
    } catch (err) {
      return next(err)
    }
  })

  router.get('/api/getClient/:id', async (req, res, next) => {
    debug('A request has come to /api/getClient/:id')
    const { error } = getClientByIdValidate(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    const { id } = req.params
    try {
      const Client = await client.findById(id)
      res.send(Client)
    } catch (e) {
      return next(e)
    }
  })

  router.get('/api/searchClient/:name', async (req, res, next) => {
    debug('A request has come to /api/searchClient/:name')
    const { error } = getClientByNameValidate(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    const { name } = req.params
    try {
      const Client = await client.findByName(name)
      res.send(Client)
    } catch (e) {
      return next(e)
    }
  })

  router.get('/api/getLateClients', async (req, res, next) => {
    debug('A request has come to /api/getLateClients')
    try {
      const Clients = await client.findByPayLate()
      res.send(Clients)
    } catch (err) {
      return next(err)
    }
  })

  router.get('/api/getTodayClients', async (req, res, next) => {
    debug('A request has come to /api/getTodayClients')
    try {
      const Clients = await client.findByPayToday()
      res.send(Clients)
    } catch (err) {
      return next(err)
    }
  })
}

export default clientRoutes
