// Dependencies.
import express from 'express'
import asyncify from 'express-asyncify'

// Routes
import main from './routes/main'
import clientRoutes from './routes/client'
import { addUser } from './routes/user'

const app = asyncify(express())
const router = asyncify(express.Router())

app.use(express.json())
app.use('/', router)

// Main route
main(router)

// Client routes
clientRoutes(router)

// User routes
addUser(router)

export default app
