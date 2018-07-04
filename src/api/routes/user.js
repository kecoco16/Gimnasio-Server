import {
  addUserValidate
} from '../validators/user'

export const addUser = router => {
  router.post('/api/addUser', (req, res) => {
    const { error } = addUserValidate(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    res.send('//TODO add User in DB')
  })
}
