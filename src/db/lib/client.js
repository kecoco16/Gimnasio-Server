import { Op } from 'sequelize'

const setupClient = clientModel => {
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

  const findAll = () => clientModel.findAll()

  const findById = id => clientModel.findById(id)

  const findByIdNumber = idNumber => (
    clientModel.findOne({
      where: {
        idNumber
      }
    })
  )

  const findByName = name => (
    clientModel.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        }
      }
    })
  )

  return {
    createOrUpdate,
    findAll,
    findById,
    findByIdNumber,
    findByName
  }
}

export default setupClient
