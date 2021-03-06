// Setups.
import setupDataBase from './lib/db'
import setupClientModel from './models/client'
import setupClient from './lib/client'
import setupMembership from './lib/membership'
import setupUser from './lib/user'
import setupPayment from './lib/payment'

// Models.
import setupMembershipModel from './models/membership'
import setupUserModel from './models/user'
import setupPaymentModel from './models/payment'

// Dependencies.
import defaults from 'defaults'

const db = async config => {
  // Default config for unit tests.
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    },
    operatorsAliases: false
  })

  // Define Models.
  const sequelize = setupDataBase(config)
  const clientModel = setupClientModel(config)
  const membershipModel = setupMembershipModel(config)
  const paymentModel = setupPaymentModel(config)
  const userModel = setupUserModel(config)

  // Relationships.
  membershipModel.hasMany(clientModel)
  clientModel.belongsTo(membershipModel)
  paymentModel.belongsTo(clientModel)
  paymentModel.belongsTo(userModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const client = setupClient(clientModel, membershipModel)
  const user = setupUser(userModel)
  const membership = setupMembership(membershipModel)
  const payment = setupPayment(paymentModel, clientModel, userModel)

  return {
    user,
    client,
    membership,
    payment
  }
}

// The syntax of CommonJS to export modules is required for the unit tests, specifically for use proxyquire.
module.exports = db
