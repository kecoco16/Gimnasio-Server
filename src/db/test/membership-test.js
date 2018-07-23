// Fixtures.
import membershipFixtures from '../../commond/fixtures/membership'

// Dependencies.
import test from 'ava'
import sinon from 'sinon'
const proxyquire = require('proxyquire').noCallThru()

let ClientStub = null
let MembershipStub = null
let PaymentStub = null
let UserStub = null
let db = null
let sandbox = null
const id = 1
const newMembership = { ...membershipFixtures.single, id: 3, name: 'Test', amount: 20000 }
const name = 'Normal'
const single = { ...membershipFixtures.single }

const config = {
  logging () {}
}

const newNameArgs = {
  where: {
    name: newMembership.name
  }
}

const updateNameArgs = {
  where: {
    name
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

  // Model create Stub
  MembershipStub.create = sandbox.stub()
  MembershipStub.create.withArgs(newMembership).returns(Promise.resolve({
    toJSON () { return newMembership }
  }))

  // Model update Stub
  MembershipStub.update = sandbox.stub()
  MembershipStub.update.withArgs(single, updateNameArgs).returns(Promise.resolve(single))

  // Model findAll Stub
  MembershipStub.findAll = sandbox.stub()
  MembershipStub.findAll.withArgs().returns(Promise.resolve(membershipFixtures.all))

  // Model findById Stub
  MembershipStub.findById = sandbox.stub()
  MembershipStub.findById.withArgs(id).returns(Promise.resolve(membershipFixtures.byId(id)))

  // Model findOne Stub
  MembershipStub.findOne = sandbox.stub()
  MembershipStub.findOne.withArgs(updateNameArgs).returns(Promise.resolve(membershipFixtures.ByName(name)))

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

test.serial('Membership', t => {
  t.truthy(db.membership, 'Membership service should exist')
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

test.serial('Membership#createOrUpdate - new', async t => {
  const membership = await db.membership.createOrUpdate(newMembership)
  t.deepEqual(membership, newMembership, 'membership should be the same')
  t.true(MembershipStub.findOne.called, 'findOne should be called on model')
  t.true(MembershipStub.findOne.calledOnce, 'findOne should be called once')
  t.true(MembershipStub.findOne.calledWith(newNameArgs), 'findOne should be called with name args')
  t.true(MembershipStub.create.called, 'create should be called on model')
  t.true(MembershipStub.create.calledOnce, 'create should be called once')
  t.true(MembershipStub.create.calledWith(newMembership), 'create should be called with specified args')
})

test.serial('Membership#createOrUpdate - exist', async t => {
  const membership = await db.membership.createOrUpdate(single)
  t.deepEqual(membership, single, 'membership should be the same')
  t.true(MembershipStub.findOne.called, 'findOne should be called on model')
  t.true(MembershipStub.findOne.calledTwice, 'findOne should be called once')
  t.true(MembershipStub.findOne.calledWith(updateNameArgs), 'findOne should be called with specified name')
  t.true(MembershipStub.update.called, 'update called on model')
  t.true(MembershipStub.update.calledOnce, 'update should be called once')
  t.true(MembershipStub.update.calledWith(single), 'update should be called with specified args')
})

test.serial('Membership#findAll', async t => {
  const memberships = await db.membership.findAll()
  t.deepEqual(memberships, membershipFixtures.all, 'membership should be the same')
  t.true(MembershipStub.findAll.called, 'findAll should be called on model')
  t.true(MembershipStub.findAll.calledOnce, 'findAll should be called once')
  t.true(MembershipStub.findAll.calledWith(), 'findAll should be called without args')
})

test.serial('Client#findById', async t => {
  const membership = await db.membership.findById(id)
  t.deepEqual(membership, membershipFixtures.byId(id), 'membership should be the same')
  t.true(MembershipStub.findById.called, 'findById should be called on model')
  t.true(MembershipStub.findById.calledOnce, 'findById should be called once')
  t.true(MembershipStub.findById.calledWith(id), 'findById should be called with specified id')
})
