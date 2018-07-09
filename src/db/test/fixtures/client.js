import moment from 'moment'

const client = {
  id: 1,
  idNumber: 604280878,
  name: 'Kevin Castillo Mora',
  gender: 'M',
  phone: 86501179,
  email: 'kecoco16@gmail.com',
  profileImageRoute: '../profile/kevin.png',
  payDay: moment().add(1, 'month').calendar(),
  createdAt: new Date(),
  updatedAt: new Date()
}

const clients = [
  client,
  { ...client, id: 2, name: 'Minor Castillo', payDay: moment().format('L') },
  { ...client, id: 3, name: 'Martha Mora', gender: 'F', payDay: moment().format('L') },
  { ...client, id: 4, name: 'Michael Castillo', payDay: moment().subtract(1, 'month').calendar() },
  { ...client, id: 5, name: 'Josseline Castillo', gender: 'F', payDay: moment().subtract(1, 'month').calendar() },
  { ...client, id: 6, name: 'Conan Castillo', gender: 'M' }
]

export default {
  single: client,
  all: clients,
  byId: id => clients.filter(c => c.id === id).shift(),
  byIdNumber: idNumber => clients.filter(c => c.idNumber === idNumber).shift(),
  byName: name => clients.filter(c => c.name.includes(name)),
  byPayToday: date => clients.filter(c => c.payDay === date),
  byPayLate: date => clients.filter(c => c.payDay < date)
}
