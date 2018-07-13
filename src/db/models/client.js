// Dependencies.
import Sequelize from 'sequelize'

// Setup.
import setupDataBase from '../lib/db'

const setupClientModel = config => {
  const sequelize = setupDataBase(config)

  return sequelize.define('client', {
    idNumber: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phone: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    profileImageRoute: {
      type: Sequelize.STRING,
      allowNull: true
    },
    payDay: {
      type: Sequelize.DATE,
      allowNull: false
    }
  })
}

export default setupClientModel
