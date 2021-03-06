// DataBase.
import db from '../db'

// Auth
import { sign } from '../auth'
import { jwt } from '../../commond/setup'

// Schemas validates.
import {
  createOrUpdateUserValidate,
  loginValidate,
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

    try {
      const User = await user.createOrUpdate(req.body)
      res.send(User)
    } catch (e) {
      return next(e)
    }
  })

  router.post('/api/login', async (req, res, next) => {
    debug('A request has come to /api/login')
    const { error } = loginValidate(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    try {
      const login = await user.login(req.body)
      if (!login) {
        return res.status(401).send('Access Denied :(')
      }

      const token = `Bearer ${sign(login, jwt.secret)}`
      res.send({ token })
    } catch (e) {
      return next(e)
    }
  })

  router.get('/api/getUsers', async (req, res, next) => {
    debug('A request has come to /api/getUsers')
    try {
      const Users = await user.findAll()
      res.send(Users)
    } catch (err) {
      return next(err)
    }
  })

  router.get('/api/getUser/:id', async (req, res, next) => {
    debug('A request has come to /api/getUser/:id')
    const { error } = getUserByIdValidate(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    const { id } = req.params
    try {
      const User = await user.findById(id)
      res.send(User)
    } catch (e) {
      return next(e)
    }
  })
}

export default userRoutes
