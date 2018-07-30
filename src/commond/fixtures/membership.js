const membership = {
  id: 1,
  name: 'Normal',
  amount: 15000,
  createdAt: new Date(),
  updatedAt: new Date()
}

const sendMembership = {
  name: 'Post',
  amount: 20000
}

const memberships = [
  { ...membership },
  { ...membership, id: 2, name: 'Special', amount: 10000 }
]

export default {
  single: membership,
  sendMembership,
  all: memberships,
  ByName: name => memberships.filter(m => m.name === name).shift(),
  byId: id => memberships.filter(m => m.id === id).shift()
}
