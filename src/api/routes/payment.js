// DataBase.
import db from '../db'

// Schemas validates.
import {
  createPaymentValidate,
  searchPaymentsByDates
} from '../validators/payment'

// Debug.
const debug = require('debug')('api:payment')

const paymentRoutes = async router => {
  const { payment } = await db.get()

  router.post('/api/createPayment', async (req, res, next) => {
    debug('A request has come to /api/createPayment')
    const { error } = createPaymentValidate(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    try {
      const Payment = await payment.create(req.body)
      res.send(Payment)
    } catch (e) {
      return next(e)
    }
  })

  router.get('/api/getPayments', async (req, res, next) => {
    debug('A request has come to /api/getPayments')
    try {
      const Payments = await payment.findAll()
      res.send(Payments)
    } catch (err) {
      return next(err)
    }
  })

  router.get('/api/getTodayPayments', async (req, res, next) => {
    debug('A request has come to /api/getTodayPayments')
    try {
      const Payments = await payment.findByPayToday()
      res.send(Payments)
    } catch (err) {
      return next(err)
    }
  })

  router.get('/api/getPaymentsByDates/:from/:to', async (req, res, next) => {
    debug('A request has come to /api/getPaymentsByDates')
    const { error } = searchPaymentsByDates(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    const { from, to } = req.params
    try {
      const Payments = await payment.findByDate(from, to)
      res.send(Payments)
    } catch (err) {
      return next(err)
    }
  })
}

export default paymentRoutes
