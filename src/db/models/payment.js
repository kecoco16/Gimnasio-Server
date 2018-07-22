// Dependencies.
import Sequelize from 'sequelize'

// Setup.
import setupDataBase from '../lib/db'

const setupPaymentModel = config => {
  const sequelize = setupDataBase(config)

  return sequelize.define('payment', {
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    payDay: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    }
  })
}

export default setupPaymentModel
