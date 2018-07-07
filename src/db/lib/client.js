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

  const findById = id => clientModel.findById(id)

  return {
    createOrUpdate,
    findById
  }
}

export default setupClient
