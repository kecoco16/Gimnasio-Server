import Sequelize from 'sequelize'

let sequelize = null

const setupDataBase = config => {
  if (!sequelize) {
    sequelize = new Sequelize(config)
  }
  return sequelize
}

export default setupDataBase
