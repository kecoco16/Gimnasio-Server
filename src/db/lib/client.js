// Dependencies.
import { Op } from 'sequelize'
import moment from 'moment'

const setupClient = (clientModel, membershipModel) => {
  const createOrUpdate = async client => {
    const cond = {
      where: {
        idNumber: client.idNumber
      }
    }

    const existingClient = await clientModel.findOne(cond)

    if (existingClient) {
      const updated = await clientModel.update(client, cond)
      return updated ? clientModel.findOne(cond) : existingClient
    }

    const result = await clientModel.create(client)
    return result.toJSON()
  }

  const findAll = () => clientModel.findAll({
    include: [{
      attributes: ['name', 'amount'],
      model: membershipModel
    }],
    raw: true
  })

  const findById = id => clientModel.findById(id, {
    include: [{
      attributes: ['name', 'amount'],
      model: membershipModel
    }],
    raw: true
  })

  const findByIdNumber = idNumber => (
    clientModel.findOne({
      where: {
        idNumber
      },
      include: [{
        attributes: ['name', 'amount'],
        model: membershipModel
      }],
      raw: true
    })
  )

  const findByName = name => (
    clientModel.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      },
      include: [{
        attributes: ['name', 'amount'],
        model: membershipModel
      }],
      raw: true
    })
  )

  const findByPayToday = () => (
    clientModel.findAll({
      where: {
        payDay: moment().format('YYYY-MM-DD')
      },
      include: [{
        attributes: ['name', 'amount'],
        model: membershipModel
      }],
      raw: true
    })
  )

  const findByPayLate = () => (
    clientModel.findAll({
      where: {
        payDay: {
          [Op.lt]: moment().format('YYYY-MM-DD')
        }
      },
      include: [{
        attributes: ['name', 'amount'],
        model: membershipModel
      }],
      raw: true
    })
  )

  return {
    createOrUpdate,
    findAll,
    findById,
    findByIdNumber,
    findByName,
    findByPayToday,
    findByPayLate
  }
}

export default setupClient
