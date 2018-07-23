// Fixtures
import clientFixtures from '../../commond/fixtures/client'

// Dependencies.
import test from 'ava'
import sinon from 'sinon'
import { Op } from 'sequelize'
import moment from 'moment'
const proxyquire = require('proxyquire').noCallThru()

const config = {
  logging () {}
}

let ClientStub = null
let MembershipStub = null
let PaymentStub = null
let UserStub = null
let db = null
let sandbox = null
const id = 1
const idNumber = 604280878
const name = 'Conan'
const single = { ...clientFixtures.single }
const newClient = { ...clientFixtures.single, id: 7, name: 'Kratos Castillo', gender: 'M', idNumber: 123456789 }
const today = moment()

const newClientIdArgs = {
  where: {
    idNumber: newClient.idNumber
  }
}

const idNumberUpdateArgs = {
  where: {
    idNumber
  }
}

const idNumberArgs = {
  where: {
    idNumber
  },
  include: [{
    attributes: ['name', 'amount'],
    model: MembershipStub
  }],
  raw: true
}
const nameArgs = {
  where: {
    name: {
      [Op.iLike]: `%${name}%`
    }
  },
  include: [{
    attributes: ['name', 'amount'],
    model: MembershipStub
  }],
  raw: true
}

const payTodayArgs = {
  where: {
    payDay: moment()
  },
  include: [{
    attributes: ['name', 'amount'],
    model: MembershipStub
  }],
  raw: true
}

const payLateArgs = {
  where: {
    payDay: {
      [Op.lt]: moment()
    }
  },
  include: [{
    attributes: ['name', 'amount'],
    model: MembershipStub
  }],
  raw: true
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  ClientStub = {
    belongsTo: sandbox.spy()
  }

  MembershipStub = {
    hasMany: sandbox.spy()
  }

  PaymentStub = {
    belongsTo: sandbox.spy()
  }

  nameArgs.include[0].model = MembershipStub
  payTodayArgs.include[0].model = MembershipStub
  payLateArgs.include[0].model = MembershipStub
  idNumberArgs.include[0].model = MembershipStub

  // Model create Stub
  ClientStub.create = sandbox.stub()
  ClientStub.create.withArgs(newClient).returns(Promise.resolve({
    toJSON () { return newClient }
  }))

  // Model update Stub
  ClientStub.update = sandbox.stub()
  ClientStub.update.withArgs(single, idNumberUpdateArgs).returns(Promise.resolve(single))

  // Model findAll Stub
  ClientStub.findAll = sandbox.stub()
  ClientStub.findAll.withArgs().returns(Promise.resolve(clientFixtures.all))
  ClientStub.findAll.withArgs(nameArgs).returns(Promise.resolve(clientFixtures.byName(name)))
  ClientStub.findAll.withArgs(payTodayArgs).returns(Promise.resolve(clientFixtures.byPayToday(today)))
  ClientStub.findAll.withArgs(payLateArgs).returns(Promise.resolve(clientFixtures.byPayLate(today)))

  // Model findById Stub
  ClientStub.findById = sandbox.stub()
  ClientStub.findById.withArgs(id).returns(Promise.resolve(clientFixtures.byId(id)))

  // Model findOne Stub
  ClientStub.findOne = sandbox.stub()
  ClientStub.findOne.withArgs(idNumberUpdateArgs).returns(Promise.resolve(clientFixtures.byIdNumberUpdate(idNumber)))
  ClientStub.findOne.withArgs(idNumberArgs).returns(Promise.resolve(clientFixtures.byIdNumber(idNumber)))

  const setupDatabase = proxyquire('../', {
    './models/client': () => ClientStub,
    './models/membership': () => MembershipStub,
    './models/payment': () => PaymentStub,
    './models/user': () => UserStub
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
  t.true(PaymentStub.belongsTo.called, 'PaymentModel.belongsTo was executed')
  t.true(PaymentStub.belongsTo.calledWith(UserStub), 'Argument should be the UserModel')
})

test.serial('Client#createOrUpdate - new', async t => {
  const client = await db.client.createOrUpdate(newClient)
  t.deepEqual(client, newClient, 'client should be the same')
  t.true(ClientStub.findOne.called, 'findOne should be called on model')
  t.true(ClientStub.findOne.calledOnce, 'findOne should be called once')
  t.true(ClientStub.findOne.calledWith(newClientIdArgs), 'findOne should be called with idNumber args')
  t.true(ClientStub.create.called, 'create should be called on model')
  t.true(ClientStub.create.calledOnce, 'create should be called once')
  t.true(ClientStub.create.calledWith(newClient), 'create should be called with specified args')
})

test.serial('Client#createOrUpdate - exist', async t => {
  const client = await db.client.createOrUpdate(single)
  t.deepEqual(client, single, 'client should be the same')
  t.true(ClientStub.findOne.called, 'findOne should be called on model')
  t.true(ClientStub.findOne.calledTwice, 'findOne should be called once')
  t.true(ClientStub.findOne.calledWith(idNumberUpdateArgs), 'findOne should be called with specified idNumber')
  t.true(ClientStub.update.called, 'update called on model')
  t.true(ClientStub.update.calledOnce, 'update should be called once')
  t.true(ClientStub.update.calledWith(single), 'update should be called with specified args')
})

test.serial('Client#findAll', async t => {
  const clients = await db.client.findAll()
  t.deepEqual(clients, clientFixtures.all, 'clients should be the same')
  t.true(ClientStub.findAll.called, 'findAll should be called on model')
  t.true(ClientStub.findAll.calledOnce, 'findAll should be called once')
  t.true(ClientStub.findAll.calledWith(), 'findAll should be called without args')
})

test.serial('Client#findById', async t => {
  const client = await db.client.findById(id)
  t.deepEqual(client, clientFixtures.byId(id), 'should be the same')
  t.true(ClientStub.findById.called, 'findById should be called on model')
  t.true(ClientStub.findById.calledOnce, 'findById should be called once')
  t.true(ClientStub.findById.calledWith(id), 'findById should be called with specified id')
})

test.serial('Client#findByIdNumber', async t => {
  const client = await db.client.findByIdNumber(idNumber)
  t.deepEqual(client, clientFixtures.byIdNumber(idNumber), 'should be the same')
  t.true(ClientStub.findOne.called, 'findOne should be called on model')
  t.true(ClientStub.findOne.calledOnce, 'findOne should be called once')
  t.true(ClientStub.findOne.calledWith(idNumberArgs), 'findOne should be called with uuid args')
})

test.serial('Client#findByName', async t => {
  const clients = await db.client.findByName(name)
  t.deepEqual(clients, clientFixtures.byName(name), 'should be the same')
  t.true(ClientStub.findAll.called, 'findAll should be called on model')
  t.true(ClientStub.findAll.calledOnce, 'findAll should be called once')
  t.true(ClientStub.findAll.calledWith(nameArgs), 'findAll should be called with name args')
})

test.serial('Client#findByPayToday', async t => {
  const clients = await db.client.findByPayToday(today)
  t.deepEqual(clients, clientFixtures.byPayToday(today), 'should be the same')
  t.true(ClientStub.findAll.called, 'findAll should be called on model')
  t.true(ClientStub.findAll.calledOnce, 'findAll should be called once')
  t.true(ClientStub.findAll.calledWith(payTodayArgs), 'findAll should be called with pay today args')
})

test.serial('Client#findByPayLate', async t => {
  const clients = await db.client.findByPayLate(today)
  t.deepEqual(clients, clientFixtures.byPayLate(today), 'should be the same')
  t.true(ClientStub.findAll.called, 'findAll should be called on model')
  t.true(ClientStub.findAll.calledOnce, 'findAll should be called once')
  t.true(ClientStub.findAll.calledWith(payLateArgs), 'findAll should be called with pay today args')
})
