import {
  addClientValidate,
  getClientValidate,
  deleteClientValidate,
  updateClientValidate
} from '../validators/client'

export const addClient = router => {
  router.post('/api/addClient', (req, res) => {
    const { error } = addClientValidate(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    res.send('//TODO add client in DB')
  })
}

export const getClient = router => {
  router.get('/api/getClient/:id', (req, res) => {
    const { error } = getClientValidate(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    res.send('//TODO get client info')
  })
}

export const deleteClient = router => {
  router.delete('/api/deleteClient/:id', (req, res) => {
    const { error } = deleteClientValidate(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    res.send('//TODO delete client in DB')
  })
}

export const updateClient = router => {
  router.put('/api/updateClient/:id', (req, res) => {
    const { error } = updateClientValidate(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    res.send('//TODO update client in DB')
  })
}
