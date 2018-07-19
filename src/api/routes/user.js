// DataBase.
import db from '../db'

// Schemas validates.
import {
  createOrUpdateUserValidate,
  getUserByIdValidate
} from '../validators/user'

// Debug.
const debug = require('debug')('api:user')

const userRoutes = async router => {
  const { user } = await db.get()

  router.post('/api/createOrUpdateUser', async (req, res, next) => {
    debug('A request has come to /api/createOrUpdateUser')
    const { error } = createOrUpdateUserValidate(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    let User = []
    try {
      User = await user.createOrUpdate(req.body)
    } catch (e) {
      return next(e)
    }
    res.send(User)
  })

  router.get('/api/getUsers', async (req, res, next) => {
    debug('A request has come to /api/getUsers')
    let Users = []
    try {
      Users = await user.findAll()
    } catch (err) {
      return next(err)
    }
    res.send(Users)
  })

  router.get('/api/getUser/:id', async (req, res, next) => {
    debug('A request has come to /api/getUser/:id')
    const { error } = getUserByIdValidate(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    const { id } = req.params
    let User = []
    try {
      User = await user.findById(id)
    } catch (e) {
      return next(e)
    }
    res.send(User)
  })
}

export default userRoutes
