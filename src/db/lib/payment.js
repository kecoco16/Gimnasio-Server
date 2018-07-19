// Dependencies.
import { Op } from 'sequelize'
import moment from 'moment'

const setupPayment = (paymentModel, clientModel, userModel) => {
  const create = async payment => {
    const result = await paymentModel.create(payment)
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

  const findByPayToday = () => (
    paymentModel.findAll({
      where: {
        date: moment().format('L')
      },
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
  )

  const findByDate = (from, to) => (
    paymentModel.findAll({
      where: {
        date: {
          [Op.between]: [from, to]
        }
      },
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
  )

  return {
    create,
    findAll,
    findByPayToday,
    findByDate
  }
}

export default setupPayment
