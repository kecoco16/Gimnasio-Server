const user = {
  id: 1,
  name: 'Admin',
  password: 'Admin1',
  type: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
}

const sendUser = {
  name: 'kevin',
  password: 'Password1',
  type: 'admin'
}
const users = [
  { ...user },
  { ...user, id: 2, name: 'Root', password: 'Root1', type: 'root' }
]

export default {
  single: user,
  sendUser,
  all: users,
  login: user => users.filter(u => u.name === user.name && u.password === user.password).shift(),
  ByName: name => users.filter(u => u.name === name).shift(),
  byId: id => users.filter(u => u.id === id).shift()
}
