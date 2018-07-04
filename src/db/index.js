import setupDataBase from './lib/db'
import setupClientModel from './models/client'
import setupMembershipModel from './models/membership'

const db = async config => {
  const sequelize = setupDataBase(config)
  const clientModel = setupClientModel(config)
  const membershipModel = setupMembershipModel(config)

  membershipModel.hasMany(clientModel)
  clientModel.belongsTo(membershipModel)

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
