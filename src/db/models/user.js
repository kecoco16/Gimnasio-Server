// Dependencies.
import Sequelize from 'sequelize'

// Setup.
import setupDataBase from '../lib/db'

const setupUserModel = config => {
  const sequelize = setupDataBase(config)

  return sequelize.define('user', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}

export default setupUserModel
