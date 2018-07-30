// DataBase.
import db from '../db'

// Schemas validates.
import {
  createOrUpdateMembershipValidate,
  getMembershipByIdValidate
} from '../validators/membership'

// Debug.
const debug = require('debug')('api:membership')

const membershipRoutes = async router => {
  const { membership } = await db.get()

  router.post('/api/createOrUpdateMembership', async (req, res, next) => {
    debug('A request has come to /api/createOrUpdateMembership')
    const { error } = createOrUpdateMembershipValidate(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    try {
      const Membership = await membership.createOrUpdate(req.body)
      res.send(Membership)
    } catch (e) {
      return next(e)
    }
  })

  router.get('/api/getMemberships', async (req, res, next) => {
    debug('A request has come to /api/getMemberships')
    try {
      const Membership = await membership.findAll()
      res.send(Membership)
    } catch (err) {
      return next(err)
    }
  })

  router.get('/api/getMembership/:id', async (req, res, next) => {
    debug('A request has come to /api/getMembership/:id')
    const { error } = getMembershipByIdValidate(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    const { id } = req.params
    try {
      const Membership = await membership.findById(id)
      res.send(Membership)
    } catch (e) {
      return next(e)
    }
  })
}

// The syntax of CommonJS to export modules is required for the integration tests, specifically for use proxyquire.
module.exports = membershipRoutes
