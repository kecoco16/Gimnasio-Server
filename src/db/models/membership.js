import Sequelize from 'sequelize'
import setupDataBase from '../lib/db'

const setupMembershipModel = config => {
  const sequelize = setupDataBase(config)

  return sequelize.define('membership', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
}

export default setupMembershipModel
