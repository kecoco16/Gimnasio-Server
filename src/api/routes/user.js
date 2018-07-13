// DataBase.
import db from '../db'

// Schemas.
import {
  addUserValidate
} from '../validators/user'

// Debug.
const debug = require('debug')('api:user')

const userRoutes = async router => {
  const { user } = await db()
  router.post('/api/addUser', async (req, res, next) => {
    debug('A request has come to /api/addUser')
    const { error } = addUserValidate(req.body)
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
}

export default userRoutes
