// Dependencies.
import express from 'express'
import asyncify from 'express-asyncify'

// Auth
import auth from 'express-jwt'
import { jwt } from '../commond/setup'

// Routes
import main from './routes/main'
import clientRoutes from './routes/client'
import userRoutes from './routes/user'
import membershipRoutes from './routes/membership'
import paymentRoutes from './routes/payment'

const app = asyncify(express())
const router = asyncify(express.Router())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(auth(jwt).unless({ path: [ '/uploads', '/', '/api/login' ] }))
app.use('/', router)

// Main route.
main(router)

// Client routes.
clientRoutes(router)

// User routes.
userRoutes(router)

// Membership routes.
membershipRoutes(router)

// Payment routes.
paymentRoutes(router)

export default app
