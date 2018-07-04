import express from 'express'
import main from './routes/main'
import {
  addClient,
  getClients,
  getClient,
  getLateClients,
  getTodayClients,
  searchClient,
  deleteClient,
  updateClient
} from './routes/client'

import { addUser } from './routes/user'

const app = express()
const router = express.Router()

app.use(express.json())

// Main route
main(router)

// Client routes
addClient(router)
getClients(router)
getClient(router)
getLateClients(router)
getTodayClients(router)
searchClient(router)
deleteClient(router)
updateClient(router)

// User routes
addUser(router)

app.use('/', router)

export default app
