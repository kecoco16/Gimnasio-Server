const setupMembershipt = membershiptModel => {
  const createOrUpdate = async membership => {
    const cond = {
      where: {
        name: membership.name
      }
    }

    const existingMembership = await membershiptModel.findOne(cond)

    if (existingMembership) {
      const updated = await membershiptModel.update(membership, cond)
      return updated ? membershiptModel.findOne(cond) : existingMembership
    }

    const result = await membershiptModel.create(membership)
    return result.toJSON()
  }

  const findAll = () => membershiptModel.findAll()

  const findById = id => membershiptModel.findById(id)

  return {
    createOrUpdate,
    findAll,
    findById
  }
}

export default setupMembershipt
