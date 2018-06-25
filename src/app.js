import express from 'express'
import main from './routes/main'

const app = express()
const router = express.Router()

main(router)

app.use('/', router)

export default app
