const client = {
  id: 1,
  idNumber: 604280878,
  name: 'Kevin Castillo Mora',
  gender: 'M',
  phone: 86501179,
  email: 'kecoco16@gmail.com',
  profileImageRoute: '../profile/kevin.png',
  payDay: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
}

const clients = [
  client,
  { ...client, id: 2, name: 'Minor Catillo' },
  { ...client, id: 3, name: 'Martha Mora', gender: 'F' },
  { ...client, id: 4, name: 'Michael Catillo' },
  { ...client, id: 5, name: 'Josseline Catillo', gender: 'F' }
]

export default {
  single: client,
  all: clients,
  byId: id => clients.filter(c => c.id === id).shift(),
  byName: name => clients.filter(c => c.name === name).shift()
}
