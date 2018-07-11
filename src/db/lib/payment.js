// import { Op } from 'sequelize'
// import moment from 'moment'

const setupPayment = (paymentModel, clientModel, userModel) => {
  const create = async payment => {
    const result = await clientModel.create(payment)
    return result.toJSON()
  }

  const findAll = () => paymentModel.findAll({
    include: [{
      attributes: ['name'],
      model: clientModel
    },
    {
      attributes: ['name'],
      model: userModel
    }],
    raw: true
  })

  // const findById = id => clientModel.findById(id, {
  //   include: [{
  //     attributes: ['name', 'amount'],
  //     model: membershipModel
  //   }],
  //   raw: true
  // })

  // const findByIdNumber = idNumber => (
  //   clientModel.findOne({
  //     where: {
  //       idNumber
  //     },
  //     include: [{
  //       attributes: ['name', 'amount'],
  //       model: membershipModel
  //     }],
  //     raw: true
  //   })
  // )

  // const findByName = name => (
  //   clientModel.findAll({
  //     where: {
  //       name: {
  //         [Op.iLike]: `%${name}%`
  //       }
  //     },
  //     include: [{
  //       attributes: ['name', 'amount'],
  //       model: membershipModel
  //     }],
  //     raw: true
  //   })
  // )

  // const findByPayToday = () => (
  //   clientModel.findAll({
  //     where: {
  //       payDay: moment().format('L')
  //     },
  //     include: [{
  //       attributes: ['name', 'amount'],
  //       model: membershipModel
  //     }],
  //     raw: true
  //   })
  // )

  // const findByPayLate = () => (
  //   clientModel.findAll({
  //     where: {
  //       payDay: {
  //         [Op.lt]: moment().format('L')
  //       }
  //     },
  //     include: [{
  //       attributes: ['name', 'amount'],
  //       model: membershipModel
  //     }],
  //     raw: true
  //   })
  // )

  return {
    create,
    findAll
    // findById,
    // findByIdNumber,
    // findByName,
    // findByPayToday,
    // findByPayLate
  }
}

export default setupPayment
