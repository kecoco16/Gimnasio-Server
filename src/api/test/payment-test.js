// Dependencies.
import test from 'ava'
import request from 'supertest'
import sinon from 'sinon'
import moment from 'moment'

// Fixtures
import paymentFixtures from '../../commond/fixtures/payment'

// Auth
import { sign } from '../auth'
import { jwt } from '../../commond/setup'

const proxyquire = require('proxyquire').noCallThru()
let sandbox = null
let server = null
let token = null
let dbStub = {}
let paymentStub = {}
const sendPayment = { ...paymentFixtures.sendPayment }
const from = moment().subtract(2, 'month').format('YYYY-MM-DD')
const to = moment().add(1, 'day').format('YYYY-MM-DD')
// const id = 1

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  // Model create Stub
  paymentStub.create = sandbox.stub()
  paymentStub.create.withArgs(sendPayment).returns(Promise.resolve(paymentFixtures.single))

  // Model findAll Stub
  paymentStub.findAll = sandbox.stub()
  paymentStub.findAll.withArgs().returns(Promise.resolve(paymentFixtures.all))

  // Model findByPayToday Stub
  paymentStub.findByPayToday = sandbox.stub()
  paymentStub.findByPayToday.withArgs().returns(Promise.resolve(paymentFixtures.byPayToday()))

  // Model findById Stub
  paymentStub.findByDate = sandbox.stub()
  paymentStub.findByDate.withArgs(from, to).returns(Promise.resolve(paymentFixtures.byDate(from, to)))

  // Get models Stub
  dbStub.get = sandbox.stub()
  dbStub.get.withArgs().returns(Promise.resolve({ payment: paymentStub }))

  token = await sign({ username: 'test' }, jwt.secret)

  const payment = proxyquire('../routes/payment.js', {
    '../db': dbStub
  })

  const app = proxyquire('../app.js', {
    './routes/payment': payment
  })

  server = proxyquire('../', {
    './app': app
  })
})

test.afterEach(() => {
  sandbox && sandbox.restore()
})

test.serial.cb('/api/createPayment', t => {
  request(server)
    .post('/api/createPayment')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(sendPayment)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(paymentFixtures.single)
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Body body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/createPayment - not authorized', t => {
  request(server)
    .post('/api/createPayment')
    .set('Content-type', 'application/json')
    .send(sendPayment)
    .expect(401)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .end((err, res) => {
      const status = res.statusCode
      const statusExpected = 401
      const message = res.req.res.statusMessage
      const messageExpected = 'Unauthorized'
      t.falsy(err, 'Should not return an error')
      t.deepEqual(status, statusExpected, 'Status code should be the expected')
      t.deepEqual(message, messageExpected, 'Message should be the expected')
      t.truthy(res.unauthorized, 'should return true')
      t.end()
    })
})

test.serial.cb('/api/createPayment - not found bad request', t => {
  request(server)
    .post('/api/createPayment')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send({})
    .expect(400)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .end((err, res) => {
      const status = res.statusCode
      const statusExpected = 400
      const message = res.req.res.statusMessage
      const messageExpected = 'Bad Request'
      t.falsy(err, 'Should not return an error')
      t.deepEqual(status, statusExpected, 'Status code should be the expected')
      t.deepEqual(message, messageExpected, 'Message should be the expected')
      t.truthy(res.badRequest, 'should return true')
      t.end()
    })
})

test.serial.cb('/api/getPayments', t => {
  request(server)
    .get('/api/getPayments')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(paymentFixtures.all)
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/getPayments - not authorized', t => {
  request(server)
    .get('/api/getPayments')
    .expect(401)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .end((err, res) => {
      const status = res.statusCode
      const statusExpected = 401
      const message = res.req.res.statusMessage
      const messageExpected = 'Unauthorized'
      t.falsy(err, 'Should not return an error')
      t.deepEqual(status, statusExpected, 'Status code should be the expected')
      t.deepEqual(message, messageExpected, 'Message should be the expected')
      t.truthy(res.unauthorized, 'should return true')
      t.end()
    })
})

test.serial.cb('/api/getTodayPayments', t => {
  request(server)
    .get('/api/getTodayPayments')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(paymentFixtures.byPayToday())
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/getTodayPayments - not authorized', t => {
  request(server)
    .get('/api/getTodayPayments')
    .expect(401)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .end((err, res) => {
      const status = res.statusCode
      const statusExpected = 401
      const message = res.req.res.statusMessage
      const messageExpected = 'Unauthorized'
      t.falsy(err, 'Should not return an error')
      t.deepEqual(status, statusExpected, 'Status code should be the expected')
      t.deepEqual(message, messageExpected, 'Message should be the expected')
      t.truthy(res.unauthorized, 'should return true')
      t.end()
    })
})

test.serial.cb('/api/getPaymentsByDates/:from/:to', t => {
  request(server)
    .get(`/api/getPaymentsByDates/${from}/${to}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(paymentFixtures.byDate(from, to))
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/getPaymentsByDates/:from/:to - not authorized', t => {
  request(server)
    .get(`/api/getPaymentsByDates/${from}/${to}`)
    .expect(401)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .end((err, res) => {
      const status = res.statusCode
      const statusExpected = 401
      const message = res.req.res.statusMessage
      const messageExpected = 'Unauthorized'
      t.falsy(err, 'Should not return an error')
      t.deepEqual(status, statusExpected, 'Status code should be the expected')
      t.deepEqual(message, messageExpected, 'Message should be the expected')
      t.truthy(res.unauthorized, 'should return true')
      t.end()
    })
})

test.serial.cb('/api/getPaymentsByDates/:from/:to - not found bad request', t => {
  request(server)
    .get(`/api/getPaymentsByDates/bad/request`)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .end((err, res) => {
      const status = res.statusCode
      const statusExpected = 400
      const message = res.req.res.statusMessage
      const messageExpected = 'Bad Request'
      t.falsy(err, 'Should not return an error')
      t.deepEqual(status, statusExpected, 'Status code should be the expected')
      t.deepEqual(message, messageExpected, 'Message should be the expected')
      t.truthy(res.badRequest, 'should return true')
      t.end()
    })
})
