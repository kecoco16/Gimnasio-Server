import test from 'ava'
import setupDataBase from '../'

let db = null
const config = {
  logging () {}
}

test.beforeEach(async () => {
  db = await setupDataBase(config)
})

test('Membership', t => {
  t.truthy(db.membership, 'Membership service should exist')
})
