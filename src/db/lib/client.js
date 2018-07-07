const setupClient = clientModel => {
  const findById = id => clientModel.findById(id)

  return {
    findById
  }
}

export default setupClient
