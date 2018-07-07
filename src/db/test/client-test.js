import test from 'ava'
import sinon from 'sinon'
import clientFixtures from './fixtures/client'
import setupClient from '../lib/client'
const proxyquire = require('proxyquire').noCallThru()

const config = {}

let ClientStub = null
let MembershipStub = null
let PaymentStub = null

const id = 1
let db = null
let sandbox = null
// let single = { ...clientFixtures.single }

test.beforeEach(async () => {
  const sandbox = sinon.createSandbox()

  ClientStub = {
    belongsTo: sandbox.spy()
  }

  MembershipStub = {
    hasMany: sandbox.spy()
  }

  PaymentStub = {
    belongsTo: sandbox.spy()
  }

  ClientStub.findById = sandbox.stub(setupClient(), 'findById')
  ClientStub.findById.withArgs(id).returns(Promise.resolve(clientFixtures.byId(id)))

  const setupDatabase = proxyquire('../', {
    './models/client': () => ClientStub,
    './models/membership': () => MembershipStub,
    './models/payment': () => PaymentStub
  })

  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sandbox.restore()
})

test('Client', t => {
  t.truthy(db.client, 'Client service should exist')
})

test.serial('Setup', t => {
  t.true(ClientStub.belongsTo.called, 'ClientModel.belongsTo was executed')
  t.true(ClientStub.belongsTo.calledWith(MembershipStub), 'Argument should be the MembershipModel')
  t.true(MembershipStub.hasMany.called, 'MembershipModel.hasMany was executed')
  t.true(MembershipStub.hasMany.calledWith(ClientStub), 'Argument should be the ClientModel')
  t.true(PaymentStub.belongsTo.called, 'PaymentModel.belongsTo was executed')
  t.true(PaymentStub.belongsTo.calledWith(ClientStub), 'Argument should be the ClientModel')
})

test.serial('Client#findById', async t => {
  let client = await db.client.findById(id)
  t.deepEqual(client, clientFixtures.byId(id), 'should be the same')
  t.true(ClientStub.findById.called, 'findById should be called on model')
  t.true(ClientStub.findById.calledOnce, 'findById should be called once')
  t.true(ClientStub.findById.calledWith(id), 'findById should be called with specified id')
})
