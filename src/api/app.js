// Dependencies.
import express from 'express'
import asyncify from 'express-asyncify'

// Auth
import auth from 'express-jwt'
import { jwt } from '../commond/setup'

// Routes
import main from './routes/main'
import userRoutes from './routes/user'
import membershipRoutes from './routes/membership'
import paymentRoutes from './routes/payment'
const clientRoutes = require('./routes/client')

const app = asyncify(express())
const router = asyncify(express.Router())

app.use(express.json())
app.use(auth(jwt).unless({ path: '/api/login' }))
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

// The syntax of CommonJS to export modules is required for the integration tests, specifically for use proxyquire.
module.exports = app
