const user = {
  id: 1,
  name: 'Admin',
  password: 'Admin1',
  type: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
}

const users = [
  { ...user },
  { ...user, id: 2, name: 'Root', password: 'Root1', type: 'root' }
]

export default {
  single: user,
  all: users,
  ByName: name => users.filter(m => m.name === name).shift(),
  byId: id => users.filter(m => m.id === id).shift()
}
