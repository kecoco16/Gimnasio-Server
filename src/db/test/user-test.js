// Fixtures.
import userFixtures from '../../commond/fixtures/user'

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
const newUser = { ...userFixtures.single, id: 3, name: 'Test' }
const name = 'Admin'
const single = { ...userFixtures.single }
const loginUser = { name: 'Admin', password: 'Admin1' }

const config = {
  logging () {}
}

const loginArgs = {
  where: loginUser
}

const newNameArgs = {
  where: {
    name: newUser.name
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

  UserStub = {}

  // Model create Stub
  UserStub.create = sandbox.stub()
  UserStub.create.withArgs(newUser).returns(Promise.resolve({
    toJSON () { return newUser }
  }))

  // Model update Stub
  UserStub.update = sandbox.stub()
  UserStub.update.withArgs(single, updateNameArgs).returns(Promise.resolve(single))

  // Model findAll Stub
  UserStub.findAll = sandbox.stub()
  UserStub.findAll.withArgs().returns(Promise.resolve(userFixtures.all))

  // Model findById Stub
  UserStub.findById = sandbox.stub()
  UserStub.findById.withArgs(id).returns(Promise.resolve(userFixtures.byId(id)))

  // Model findOne Stub
  UserStub.findOne = sandbox.stub()
  UserStub.findOne.withArgs(updateNameArgs).returns(Promise.resolve(userFixtures.ByName(name)))
  UserStub.findOne.withArgs(loginArgs).returns(Promise.resolve(userFixtures.login(loginUser)))

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

test.serial('User', t => {
  t.truthy(db.user, 'User service should exist')
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

test.serial('User#createOrUpdate - new', async t => {
  const user = await db.user.createOrUpdate(newUser)
  t.deepEqual(user, newUser, 'user should be the same')
  t.true(UserStub.findOne.called, 'findOne should be called on model')
  t.true(UserStub.findOne.calledOnce, 'findOne should be called once')
  t.true(UserStub.findOne.calledWith(newNameArgs), 'findOne should be called with name args')
  t.true(UserStub.create.called, 'create should be called on model')
  t.true(UserStub.create.calledOnce, 'create should be called once')
  t.true(UserStub.create.calledWith(newUser), 'create should be called with specified args')
})

test.serial('User#createOrUpdate - exist', async t => {
  const user = await db.user.createOrUpdate(single)
  t.deepEqual(user, single, 'user should be the same')
  t.true(UserStub.findOne.called, 'findOne should be called on model')
  t.true(UserStub.findOne.calledTwice, 'findOne should be called once')
  t.true(UserStub.findOne.calledWith(updateNameArgs), 'findOne should be called with specified name')
  t.true(UserStub.update.called, 'update called on model')
  t.true(UserStub.update.calledOnce, 'update should be called once')
  t.true(UserStub.update.calledWith(single), 'update should be called with specified args')
})

test.serial('User#login - Successful', async t => {
  const login = await db.user.login(loginUser)
  const success = 'Successful login :)'
  t.deepEqual(login, success, 'Login should be successful!')
  t.true(UserStub.findOne.called, 'findOne should be called on model')
  t.true(UserStub.findOne.calledOnce, 'findOne should be called once')
  t.true(UserStub.findOne.calledWith(loginArgs), 'findOne should be called with specified user')
})

test.serial('User#login - Unsuccessful', async t => {
  const failUser = { name: 'Admin', password: 'Admin2' }
  const failLoginArgs = { where: failUser }
  const login = await db.user.login(failUser)
  const unsuccessful = 'Unsuccessful login :('
  t.deepEqual(login, unsuccessful, 'Login should be unsuccessful!')
  t.true(UserStub.findOne.called, 'findOne should be called on model')
  t.true(UserStub.findOne.calledOnce, 'findOne should be called once')
  t.true(UserStub.findOne.calledWith(failLoginArgs), 'findOne should be called with specified user')
})

test.serial('User#findAll', async t => {
  const users = await db.user.findAll()
  t.deepEqual(users, userFixtures.all, 'user should be the same')
  t.true(UserStub.findAll.called, 'findAll should be called on model')
  t.true(UserStub.findAll.calledOnce, 'findAll should be called once')
  t.true(UserStub.findAll.calledWith(), 'findAll should be called without args')
})

test.serial('Client#findById', async t => {
  const user = await db.user.findById(id)
  t.deepEqual(user, userFixtures.byId(id), 'user should be the same')
  t.true(UserStub.findById.called, 'findById should be called on model')
  t.true(UserStub.findById.calledOnce, 'findById should be called once')
  t.true(UserStub.findById.calledWith(id), 'findById should be called with specified id')
})
