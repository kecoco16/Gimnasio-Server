// Dependencies.
import test from 'ava'
import request from 'supertest'
import sinon from 'sinon'

// Fixtures
import membershipFixtures from '../../commond/fixtures/membership'

// Auth
import { sign } from '../auth'
import { jwt } from '../../commond/setup'

const proxyquire = require('proxyquire').noCallThru()
let sandbox = null
let server = null
let token = null
let dbStub = {}
let membershipStub = {}
const sendMembership = { ...membershipFixtures.sendMembership }
const id = 1

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  // Model createOrUpdate Stub
  membershipStub.createOrUpdate = sandbox.stub()
  membershipStub.createOrUpdate.withArgs(sendMembership).returns(Promise.resolve(membershipFixtures.single))

  // Model findAll Stub
  membershipStub.findAll = sandbox.stub()
  membershipStub.findAll.withArgs().returns(Promise.resolve(membershipFixtures.all))

  // Model findById Stub
  membershipStub.findById = sandbox.stub()
  membershipStub.findById.withArgs(id.toString()).returns(Promise.resolve(membershipFixtures.byId(id)))

  // Get models Stub
  dbStub.get = sandbox.stub()
  dbStub.get.withArgs().returns(Promise.resolve({ membership: membershipStub }))

  token = await sign({ username: 'test' }, jwt.secret)

  const membership = proxyquire('../routes/membership.js', {
    '../db': dbStub
  })

  const app = proxyquire('../app.js', {
    './routes/membership': membership
  })

  server = proxyquire('../', {
    './app': app
  })
})

test.afterEach(() => {
  sandbox && sandbox.restore()
})

test.serial.cb('/api/createOrUpdateMembership', t => {
  request(server)
    .post('/api/createOrUpdateMembership')
    .set('Content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(sendMembership)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(membershipFixtures.single)
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Body body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/createOrUpdateMembership - not authorized', t => {
  request(server)
    .post('/api/createOrUpdateMembership')
    .set('Content-type', 'application/json')
    .send(sendMembership)
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

test.serial.cb('/api/createOrUpdateMembership - not found bad request', t => {
  request(server)
    .post('/api/createOrUpdateMembership')
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

test.serial.cb('/api/getMemberships', t => {
  request(server)
    .get('/api/getMemberships')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(membershipFixtures.all)
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/getMemberships - not authorized', t => {
  request(server)
    .get('/api/getMemberships')
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

test.serial.cb('/api/getMembership/:id', t => {
  request(server)
    .get(`/api/getMembership/${id.toString()}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(membershipFixtures.byId(id))
      t.falsy(err, 'Should not return an error')
      t.deepEqual(body, expected, 'Response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/getMembership/:id - not authorized', t => {
  request(server)
    .get(`/api/getMembership/${id.toString()}`)
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

test.serial.cb('/api/getMembership/:id - not found bad request', t => {
  request(server)
    .get(`/api/getMembership/string`)
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
