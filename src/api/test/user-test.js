// Dependencies.
import test from 'ava'
import request from 'supertest'
import sinon from 'sinon'

// Fixtures
import userFixtures from '../../commond/fixtures/user'

// Auth
import { sign } from '../auth'
import { jwt } from '../../commond/setup'

const proxyquire = require('proxyquire').noCallThru()
let sandbox = null
let server = null
let token = null
let dbStub = {}
let userStub = {}
const sendUser = { ...userFixtures.sendUser }
const id = 1
const loginUser = { name: 'Admin', password: 'Admin1' }
const failLogin = { name: 'No Exist user', password: 'password' }

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  token = await sign(loginUser, jwt.secret)

  // Model createOrUpdate Stub
  userStub.createOrUpdate = sandbox.stub()
  userStub.createOrUpdate.withArgs(sendUser).returns(Promise.resolve(userFixtures.single))

  // Model findAll Stub
  userStub.findAll = sandbox.stub()
  userStub.findAll.withArgs().returns(Promise.resolve(userFixtures.all))

  // Model findById Stub
  userStub.findById = sandbox.stub()
  userStub.findById.withArgs(id.toString()).returns(Promise.resolve(userFixtures.byId(id)))

  // Model login Stub
  userStub.login = sandbox.stub()
  userStub.login.withArgs(loginUser).returns(Promise.resolve(loginUser))
  userStub.login.withArgs(failLogin).returns(Promise.resolve(false))

  // Get models Stub
  dbStub.get = sandbox.stub()
  dbStub.get.withArgs().returns(Promise.resolve({ user: userStub }))

  const user = proxyquire('../routes/user.js', {
    '../db': dbStub
  })

  const app = proxyquire('../app.js', {
    './routes/user': user
  })

  server = proxyquire('../', {
    './app': app
  })
})

test.afterEach(() => {
  sandbox && sandbox.restore()
})

test.serial.cb('/api/createOrUpdateUser', t => {
  request(server)
    .post('/api/createOrUpdateUser')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(sendUser)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(userFixtures.single)
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Body body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/createOrUpdateUser - not authorized', t => {
  request(server)
    .post('/api/createOrUpdateUser')
    .set('Content-type', 'application/json')
    .send(sendUser)
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

test.serial.cb('/api/createOrUpdateUser - not found bad request', t => {
  request(server)
    .post('/api/createOrUpdateUser')
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

test.serial.cb('/api/getUsers', t => {
  request(server)
    .get('/api/getUsers')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(userFixtures.all)
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/getUsers - not authorized', t => {
  request(server)
    .get('/api/getUsers')
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

test.serial.cb('/api/getUser/:id', t => {
  request(server)
    .get(`/api/getUser/${id.toString()}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(userFixtures.byId(id))
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/getUser/:id - not authorized', t => {
  request(server)
    .get(`/api/getUser/${id.toString()}`)
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

test.serial.cb('/api/getUser/:id - not found bad request', t => {
  request(server)
    .get(`/api/getUser/string`)
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

test.serial.cb('/api/login', t => {
  request(server)
    .post('/api/login')
    .set('Content-type', 'application/json')
    .send(loginUser)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end(async (err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify({ token: `Bearer ${token}` })
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Body body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/login - not authorized', t => {
  request(server)
    .post('/api/login')
    .set('Content-type', 'application/json')
    .send(failLogin)
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

test.serial.cb('/api/login - not found bad request', t => {
  request(server)
    .post('/api/login')
    .set('Content-type', 'application/json')
    .send({})
    .expect(400)
    .expect('Content-Type', 'text/html; charset=utf-8')
    .end(async (err, res) => {
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
