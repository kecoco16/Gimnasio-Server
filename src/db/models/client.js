import Sequelize from 'sequelize'
import setupDataBase from '../lib/db'

const setupClientModel = config => {
  const sequelize = setupDataBase(config)

  return sequelize.define('client', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}

export default setupClientModel
