const setupUser = userModel => {
  const createOrUpdate = async user => {
    const cond = {
      where: {
        name: user.name
      }
    }

    const existingUser = await userModel.findOne(cond)

    if (existingUser) {
      const updated = await userModel.update(user, cond)
      return updated ? userModel.findOne(cond) : existingUser
    }

    const result = await userModel.create(user)
    return result.toJSON()
  }

  const findAll = () => userModel.findAll()

  const findById = id => userModel.findById(id)

  return {
    createOrUpdate,
    findAll,
    findById
  }
}

export default setupUser
