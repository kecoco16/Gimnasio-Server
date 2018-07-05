import setupDataBase from './lib/db'
import setupClientModel from './models/client'
import setupMembershipModel from './models/membership'
import setupUserModel from './models/user'
import setupPaymentModel from './models/payment'
import defaults from 'defaults'

const db = async config => {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDataBase(config)
  const clientModel = setupClientModel(config)
  const membershipModel = setupMembershipModel(config)
  const paymentModel = setupPaymentModel(config)
  setupUserModel(config)

  membershipModel.hasMany(clientModel)
  clientModel.belongsTo(membershipModel)
  paymentModel.belongsTo(clientModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({force: true})
  }

  const user = {}
  const client = {}
  const membership = {}
  const payment = {}

  return {
    user,
    client,
    membership,
    payment
  }
}

export default db
