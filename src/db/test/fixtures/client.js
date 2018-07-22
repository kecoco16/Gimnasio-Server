// Dependencies.
import moment from 'moment'

const client = {
  id: 1,
  idNumber: 604280878,
  name: 'Kevin Castillo Mora',
  gender: 'M',
  phone: 86501179,
  email: 'kecoco16@gmail.com',
  profileImageRoute: '../profile/kevin.png',
  payDay: moment().add(1, 'month'),
  createdAt: new Date(),
  updatedAt: new Date(),
  membershipId: 1
}

const memberships = [
  { id: 1, name: 'Normal', amount: 15000 },
  { id: 2, name: 'Special', amount: 10000 }
]

const clientsList = [
  client,
  { ...client, id: 2, name: 'Minor Castillo', payDay: moment(), membershipId: 2 },
  { ...client, id: 3, name: 'Martha Mora', gender: 'F', payDay: moment() },
  { ...client, id: 4, name: 'Michael Castillo', payDay: moment().subtract(1, 'month'), membershipId: 2 },
  { ...client, id: 5, name: 'Josseline Castillo', gender: 'F', payDay: moment().subtract(1, 'month') },
  { ...client, id: 6, name: 'Conan Castillo', gender: 'M', membershipId: 2 }
]

const clients = clientsList.map(c => {
  const membership = memberships.filter(m => m.id === c.membershipId)
  const { name, amount } = membership[0]
  return { ...c, 'membership.name': name, 'membership.amount': amount }
})

export default {
  single: client,
  all: clients,
  byId: id => clients.filter(c => c.id === id).shift(),
  byIdNumberUpdate: idNumber => clientsList.filter(c => c.idNumber === idNumber).shift(),
  byIdNumber: idNumber => clients.filter(c => c.idNumber === idNumber).shift(),
  byName: name => clients.filter(c => c.name.includes(name)),
  byPayToday: date => clients.filter(c => c.payDay === date),
  byPayLate: date => clients.filter(c => c.payDay < date)
}
