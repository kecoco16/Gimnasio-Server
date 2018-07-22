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

  const login = async user => {
    const cond = {
      where: {
        name: user.name,
        password: user.password
      }
    }

    const existingUser = await userModel.findOne(cond)

    if (existingUser) {
      return 'Successful login :)'
    }

    return 'Unsuccessful login :('
  }

  const findAll = () => userModel.findAll()

  const findById = id => userModel.findById(id)

  return {
    createOrUpdate,
    login,
    findAll,
    findById
  }
}

export default setupUser
