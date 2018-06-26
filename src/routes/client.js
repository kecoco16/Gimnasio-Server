import { addClientValidate } from '../validators/client'

export const addClient = router => {
  router.post('/api/addClient', (req, res) => {
    const { error } = addClientValidate(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    res.send('No hay error')
  })
}
