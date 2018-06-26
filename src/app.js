import express from 'express'
import main from './routes/main'
import { addClient } from './routes/client'

const app = express()
const router = express.Router()

app.use(express.json())

main(router)
addClient(router)

app.use('/', router)

export default app
