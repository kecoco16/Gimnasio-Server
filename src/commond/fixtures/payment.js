// Dependencies.
import moment from 'moment'

const paymentExample = {
  id: 1,
  amount: 10000,
  payDay: moment(),
  date: moment().format('YYYY-MM-DD'),
  createdAt: new Date(),
  updatedAt: new Date(),
  clientId: 1,
  userId: 1
}

const sendPayment = {
  'amount': 10000,
  'clientId': '1',
  'userId': '1'
}

const paymentsList = [
  paymentExample,
  { ...paymentExample, id: 2, amount: 15000, payDay: moment().subtract(1, 'month').format('YYYY-MM-DD'), clientId: 2, userId: 2 },
  { ...paymentExample, id: 3, payDay: moment().subtract(7, 'days'), userId: 2, date: moment().add(1, 'month').format('YYYY-MM-DD') },
  { ...paymentExample, id: 4, clientId: 2, date: moment().subtract(10, 'days').format('YYYY-MM-DD') }
]

const clients = [
  { id: 1, name: 'Client 1' },
  { id: 2, name: 'Client 2' }
]

const users = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Root' }
]

const payments = paymentsList.map(p => {
  const client = clients.filter(c => c.id === p.clientId)
  const clientName = client[0].name
  const user = users.filter(u => u.id === p.userId)
  const userName = user[0].name
  return { ...p, 'client.name': clientName, 'user.name': userName }
})

export default {
  single: paymentExample,
  sendPayment,
  all: payments,
  byPayToday: () => payments.filter(p => p.date === moment().format('YYYY-MM-DD')),
  byDate: (from, to) => payments.filter(p => p.date > from && p.date < to)
}
