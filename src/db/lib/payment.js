// Dependencies.
import { Op } from 'sequelize'
import moment from 'moment'

const setupPayment = (paymentModel, clientModel, userModel) => {
  const create = async payment => {
    const cond = {
      where: {
        id: payment.clientId
      }
    }

    const client = await clientModel.findOne(cond)
    const payDay = moment(client.payDay).add(1, 'month')
    await clientModel.update({ payDay }, cond)
    const params = {
      ...payment,
      payDay,
      date: moment()
    }
    const result = await paymentModel.create(params)
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
        date: moment()
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
