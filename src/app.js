import express from 'express'
import mainRoute from './routes/main'

const app = express()
const router = express.Router()

mainRoute(router)

app.use('/', router)

export default app
