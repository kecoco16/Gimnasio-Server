import test from 'ava'
import setupDataBase from '../'

let db = null
const config = {
  logging () {}
}

test.beforeEach(async () => {
  db = await setupDataBase(config)
})

test('User', t => {
  t.truthy(db.user, 'User service should exist')
})
