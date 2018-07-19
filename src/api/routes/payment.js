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
    let Payment = []
    try {
      Payment = await payment.create(req.body)
    } catch (e) {
      return next(e)
    }
    res.send(Payment)
  })

  router.get('/api/getPayments', async (req, res, next) => {
    debug('A request has come to /api/getPayments')
    let Payments = []
    try {
      Payments = await payment.findAll()
    } catch (err) {
      return next(err)
    }
    res.send(Payments)
  })

  router.get('/api/getTodayPayments', async (req, res, next) => {
    debug('A request has come to /api/getTodayPayments')
    let Payments = []
    try {
      Payments = await payment.findByPayToday()
    } catch (err) {
      return next(err)
    }
    res.send(Payments)
  })

  router.get('/api/getPaymentsByDates/:from/:to', async (req, res, next) => {
    debug('A request has come to /api/getPaymentsByDates')
    const { error } = searchPaymentsByDates(req.params)
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    const { from, to } = req.params
    let Payments = []
    try {
      Payments = await payment.findByDate(from, to)
    } catch (err) {
      return next(err)
    }
    res.send(Payments)
  })
}

export default paymentRoutes
