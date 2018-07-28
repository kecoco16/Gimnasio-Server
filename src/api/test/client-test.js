// Dependencies.
import test from 'ava'
import request from 'supertest'
import sinon from 'sinon'

// Fixtures
import clientFixtures from '../../commond/fixtures/client'

// Auth
import { sign } from '../auth'
import { jwt } from '../../commond/setup'

const proxyquire = require('proxyquire').noCallThru()
let sandbox = null
let server = null
let token = null
let dbStub = {}
let ClientStub = {}
const sendClient = { ...clientFixtures.sendClient }
const id = 1
const name = 'Kevin'

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  // Model createOrUpdate Stub
  ClientStub.createOrUpdate = sandbox.stub()
  ClientStub.createOrUpdate.withArgs(sendClient).returns(Promise.resolve(clientFixtures.single))

  // Model findAll Stub
  ClientStub.findAll = sandbox.stub()
  ClientStub.findAll.withArgs().returns(Promise.resolve(clientFixtures.all))

  // Model findById Stub
  ClientStub.findById = sandbox.stub()
  ClientStub.findById.withArgs(id.toString()).returns(Promise.resolve(clientFixtures.byId(id)))

  // Model findByName Stub
  ClientStub.findByName = sandbox.stub()
  ClientStub.findByName.withArgs(name).returns(Promise.resolve(clientFixtures.byName(name)))

  // Model findByPayLate Stub
  ClientStub.findByPayLate = sandbox.stub()
  ClientStub.findByPayLate.withArgs().returns(Promise.resolve(clientFixtures.byPayLate()))

  // Model findByPayToday Stub
  ClientStub.findByPayToday = sandbox.stub()
  ClientStub.findByPayToday.withArgs().returns(Promise.resolve(clientFixtures.byPayToday()))

  // Get models Stub
  dbStub.get = sandbox.stub()
  dbStub.get.withArgs().returns(Promise.resolve({ client: ClientStub }))

  token = await sign({ username: 'test' }, jwt.secret)

  const client = proxyquire('../routes/client.js', {
    '../db': dbStub
  })

  const app = proxyquire('../app.js', {
    './routes/client': client
  })

  server = proxyquire('../', {
    './app': app
  })
})

test.afterEach(() => {
  sandbox && sandbox.restore()
})

test.serial.cb('/api/createOrUpdateClient', t => {
  request(server)
    .post('/api/createOrUpdateClient')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(sendClient)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(clientFixtures.single)
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Body body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/createOrUpdateClient - not authorized', t => {
  request(server)
    .post('/api/createOrUpdateClient')
    .set('Content-type', 'application/json')
    .send(sendClient)
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

test.serial.cb('/api/createOrUpdateClient - not found bad request', t => {
  request(server)
    .post('/api/createOrUpdateClient')
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

test.serial.cb('/api/getClients', t => {
  request(server)
    .get('/api/getClients')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(clientFixtures.all)
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/getClients - not authorized', t => {
  request(server)
    .get('/api/getClients')
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

test.serial.cb('/api/getClient/:id', t => {
  request(server)
    .get(`/api/getClient/${id.toString()}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(clientFixtures.byId(id))
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/getClient/:id - not authorized', t => {
  request(server)
    .get(`/api/getClient/${id.toString()}`)
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

test.serial.cb('/api/getClient/:id - not found bad request', t => {
  request(server)
    .get(`/api/getClient/string`)
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

test.serial.cb('/api/searchClient/:name', t => {
  request(server)
    .get(`/api/searchClient/${name}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(clientFixtures.byName(name))
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/searchClient/:name - not authorized', t => {
  request(server)
    .get(`/api/searchClient/${name}`)
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

test.serial.cb('/api/getLateClients', t => {
  request(server)
    .get('/api/getLateClients')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(clientFixtures.byPayLate())
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/getLateClients - not authorized', t => {
  request(server)
    .get('/api/getLateClients')
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

test.serial.cb('/api/getTodayClients', t => {
  request(server)
    .get('/api/getTodayClients')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(clientFixtures.byPayToday())
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/getTodayClients - not authorized', t => {
  request(server)
    .get('/api/getTodayClients')
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
