import Sequelize from 'sequelize'
import setupDataBase from '../lib/db'

const setupPaymentModel = config => {
  const sequelize = setupDataBase(config)

  return sequelize.define('payment', {
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    payDay: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
}

export default setupPaymentModel
