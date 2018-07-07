import test from 'ava'
import sinon from 'sinon'
import clientFixtures from './fixtures/client'
const proxyquire = require('proxyquire').noCallThru()

const config = {
  logging () {}
}

let ClientStub = null
let MembershipStub = null
let PaymentStub = null

let db = null
let sandbox = null
const id = 1
const idNumber = 604280878
const single = { ...clientFixtures.single }
const newClient = { ...clientFixtures.single, id: 6, name: 'Conan Catillo', gender: 'M', idNumber: 123456789 }

const idNumberArgs = {
  where: {
    idNumber
  }
}

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

  // Model findOne Stub
  ClientStub.findOne = sandbox.stub()
  ClientStub.findOne.withArgs(idNumberArgs).returns(Promise.resolve(clientFixtures.byIdNumber(idNumber)))

  // Model update Stub
  ClientStub.update = sandbox.stub()
  ClientStub.update.withArgs(single, idNumberArgs).returns(Promise.resolve(single))

  // Model create Stub
  ClientStub.create = sandbox.stub()
  ClientStub.create.withArgs(newClient).returns(Promise.resolve({
    toJSON () { return newClient }
  }))

  // Model findById Stub
  ClientStub.findById = sandbox.stub()
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

test.serial('Client', t => {
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

test.serial('Client#createOrUpdate - exist', async t => {
  const client = await db.client.createOrUpdate(single)
  t.true(ClientStub.findOne.called, 'ClientStub.findOne should be called on model')
  t.true(ClientStub.findOne.calledTwice, 'ClientStub.findOne should be called once')
  t.true(ClientStub.findOne.calledWith(idNumberArgs), 'ClientStub.findOne should be called with specified idNumber')
  t.true(ClientStub.update.called, 'agent.update called on model')
  t.true(ClientStub.update.calledOnce, 'agent.update should be called once')
  t.true(ClientStub.update.calledWith(single), 'agent.update should be called with specified args')
  t.deepEqual(client, single, 'client should be the same')
})

test.serial('Client#createOrUpdate - new', async t => {
  const client = await db.client.createOrUpdate(newClient)
  t.true(ClientStub.findOne.called, 'findOne should be called on model')
  t.true(ClientStub.findOne.calledOnce, 'findOne should be called once')
  t.true(ClientStub.findOne.calledWith({
    where: { idNumber: newClient.idNumber }
  }), 'findOne should be called with idNumber args')
  t.true(ClientStub.create.called, 'create should be called on model')
  t.true(ClientStub.create.calledOnce, 'create should be called once')
  t.true(ClientStub.create.calledWith(newClient), 'create should be called with specified args')
  t.deepEqual(client, newClient, 'agent should be the same')
})

test.serial('Client#findById', async t => {
  const client = await db.client.findById(id)
  t.true(ClientStub.findById.called, 'findById should be called on model')
  t.true(ClientStub.findById.calledOnce, 'findById should be called once')
  t.true(ClientStub.findById.calledWith(id), 'findById should be called with specified id')
  t.deepEqual(client, clientFixtures.byId(id), 'should be the same')
})
