import test from 'ava'
import setupDataBase from '../'

let db = null
const config = {
  logging () {}
}

test.beforeEach(async () => {
  db = await setupDataBase(config)
})

test('Payments', t => {
  t.truthy(db.payment, 'Payment service should exist')
})
