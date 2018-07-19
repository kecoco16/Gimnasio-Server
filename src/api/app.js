// Dependencies.
import express from 'express'
import asyncify from 'express-asyncify'

// Routes
import main from './routes/main'
import clientRoutes from './routes/client'
import userRoutes from './routes/user'
import membershipRoutes from './routes/membership'
import paymentRoutes from './routes/payment'

const app = asyncify(express())
const router = asyncify(express.Router())

app.use(express.json())
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
