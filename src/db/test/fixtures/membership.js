const membership = {
  id: 1,
  name: 'Normal',
  amount: 15000,
  createdAt: new Date(),
  updatedAt: new Date()
}

const memberships = [
  { ...membership },
  { ...membership, id: 2, name: 'Special', amount: 10000 }
]

export default {
  single: membership,
  all: memberships,
  ByName: name => memberships.filter(m => m.name === name).shift(),
  byId: id => memberships.filter(m => m.id === id).shift()
}
