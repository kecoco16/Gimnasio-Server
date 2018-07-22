// Fixtures.
import paymentFixtures from './fixtures/payment'
import clientFixtures from './fixtures/client'

// Dependencies.
import test from 'ava'
import sinon from 'sinon'
import moment from 'moment'
import { Op } from 'sequelize'
const proxyquire = require('proxyquire').noCallThru()

let ClientStub = null
let MembershipStub = null
let PaymentStub = null
let UserStub = null
let db = null
let sandbox = null
const from = moment().subtract(1, 'month').calendar()
const to = moment().add(15, 'days').calendar()
const newPayment = { ...paymentFixtures.single }
const clientId = newPayment.clientId
const newPayDay = moment(newPayment.payDay).add(1, 'month')

const config = {
  logging () {}
}

const payTodayArgs = {
  where: {
    date: moment().format('L')
  },
  include: [{
    attributes: ['name'],
    model: ClientStub
  },
  {
    attributes: ['name'],
    model: UserStub
  }],
  raw: true
}

const filterDateArgs = {
  where: {
    date: {
      [Op.between]: [from, to]
    }
  },
  include: [{
    attributes: ['name'],
    model: ClientStub
  },
  {
    attributes: ['name'],
    model: UserStub
  }],
  raw: true
}

const clientPayArgs = {
  where: {
    id: clientId
  }
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

  payTodayArgs.include[0].model = ClientStub
  payTodayArgs.include[1].model = UserStub
  filterDateArgs.include[0].model = ClientStub
  filterDateArgs.include[1].model = UserStub

  // Model create Stub
  PaymentStub.create = sandbox.stub()
  PaymentStub.create.withArgs(newPayment).returns(Promise.resolve({
    toJSON () { return newPayment }
  }))

  // Model findAll Stub
  PaymentStub.findAll = sandbox.stub()
  PaymentStub.findAll.withArgs().returns(Promise.resolve(paymentFixtures.all))
  PaymentStub.findAll.withArgs(payTodayArgs).returns(Promise.resolve(paymentFixtures.byPayToday()))
  PaymentStub.findAll.withArgs(filterDateArgs).returns(Promise.resolve(paymentFixtures.byDate(from, to)))

  // Model findOne Stub
  ClientStub.findOne = sandbox.stub()
  ClientStub.findOne.withArgs(clientPayArgs).returns(Promise.resolve(clientFixtures.byId(clientId)))

  // Model update Stub
  ClientStub.update = sandbox.stub()
  ClientStub.update.withArgs({ payDay: newPayDay }, clientPayArgs).returns(Promise.resolve())

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

test.serial('Payments', t => {
  t.truthy(db.payment, 'Payment service should exist')
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

test.serial('Payment#create', async t => {
  const payment = await db.payment.create(newPayment)
  t.deepEqual(payment, newPayment, 'client should be the same')
  t.true(PaymentStub.create.called, 'create should be called on model')
  t.true(PaymentStub.create.calledOnce, 'create should be called once')
  t.true(PaymentStub.create.calledWith(newPayment), 'create should be called with specified args')
})

test.serial('Payment#findAll', async t => {
  const payments = await db.payment.findAll()
  t.deepEqual(payments, paymentFixtures.all, 'clients should be the same')
  t.true(PaymentStub.findAll.called, 'findAll should be called on model')
  t.true(PaymentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(PaymentStub.findAll.calledWith(), 'findAll should be called without args')
})

test.serial('Client#findByPayToday', async t => {
  const payments = await db.payment.findByPayToday()
  t.deepEqual(payments, paymentFixtures.byPayToday(), 'should be the same')
  t.true(PaymentStub.findAll.called, 'findAll should be called on model')
  t.true(PaymentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(PaymentStub.findAll.calledWith(payTodayArgs), 'findAll should be called with pay today args')
})

test.serial('Client#findByFilterDate', async t => {
  const payments = await db.payment.findByDate(from, to)
  t.deepEqual(payments, paymentFixtures.byDate(from, to), 'should be the same')
  t.true(PaymentStub.findAll.called, 'findAll should be called on model')
  t.true(PaymentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(PaymentStub.findAll.calledWith(filterDateArgs), 'findAll should be called with pay today args')
})
