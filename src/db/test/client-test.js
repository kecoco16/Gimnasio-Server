import test from 'ava'
import setupDataBase from '../'

let db = null

test.beforeEach(async () => {
  db = await setupDataBase()
})

test('make it pass', t => {
  t.truthy(db.client, 'Client service should exist')
})
