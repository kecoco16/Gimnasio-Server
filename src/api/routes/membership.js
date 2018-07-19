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
    let Membership = []
    try {
      Membership = await membership.createOrUpdate(req.body)
    } catch (e) {
      return next(e)
    }
    res.send(Membership)
  })

  router.get('/api/getMemberships', async (req, res, next) => {
    debug('A request has come to /api/getMemberships')
    let Membership = []
    try {
      Membership = await membership.findAll()
    } catch (err) {
      return next(err)
    }
    res.send(Membership)
  })

  router.get('/api/getMembership/:id', async (req, res, next) => {
    debug('A request has come to /api/getMembership/:id')
    const { error } = getMembershipByIdValidate(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    const { id } = req.params
    let Membership = []
    try {
      Membership = await membership.findById(id)
    } catch (e) {
      return next(e)
    }
    res.send(Membership)
  })
}

export default membershipRoutes
