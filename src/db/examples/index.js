// Dependencies.
import moment from 'moment'
import { dbConfig } from '../../commond/setup'
const debug = require('debug')('db:examples')

// DataBase.
const db = require('../')

const run = async () => {
  try {
    const { client, membership, user, payment } = await db(dbConfig(debug, true))

    const usersExamples = [
      { name: 'Admin', password: 'Admin1', type: 'admin' },
      { name: 'Root', password: 'Root1', type: 'root' }
    ]

    const membershipsExamples = [
      { name: 'Normal', amount: 15000 },
      { name: 'Special', amount: 10000 }
    ]

    const clientExample = {
      idNumber: 111111111,
      name: 'New Client',
      gender: 'M',
      phone: 88888888,
      email: 'test@mail.com',
      profileImageRoute: 'profile.png',
      payDay: moment().add(1, 'month'),
      membershipId: 1
    }

    const clientsList = [
      clientExample,
      { ...clientExample, name: 'Pay today', idNumber: 222222222, payDay: moment().subtract(2, 'month'), membershipId: 2 },
      { ...clientExample, name: 'Late pay', idNumber: 333333333, payDay: moment().subtract(1, 'month') }
    ]

    const paymentExample = {
      amount: 10000,
      clientId: 1,
      userId: 1
    }

    const paymentsList = [
      paymentExample,
      { amount: 15000, clientId: 2, userId: 2 },
      { ...paymentExample, clientId: 2, userId: 2 },
      { ...paymentExample }
    ]

    // < ============================================= User Examples ============================================= >
    for (let i = 0; i < usersExamples.length; i++) {
      const createOrUpdateUser = await user.createOrUpdate(usersExamples[i])
      debug('< ================== Create or update user. ================== >')
      debug(createOrUpdateUser)
    }

    const login = await user.login({ name: 'Admin', password: 'Admin1' })
    debug('< ====================== login ====================== >')
    debug(login)

    const getUsers = await user.findAll()
    debug('< ====================== getUsers ====================== >')
    debug(getUsers)

    const getUserById = await user.findById(1)
    debug('< ====================== getUserById ====================== >')
    debug(getUserById)

    // < ============================================ User Examples ============================================ />

    // < ========================================== Membership Examples ========================================== >
    for (let i = 0; i < membershipsExamples.length; i++) {
      const createOrUpdateMembership = await membership.createOrUpdate(membershipsExamples[i])
      debug('< ================== Create or update membership. ================== >')
      debug(createOrUpdateMembership)
    }

    const getMemberships = await membership.findAll()
    debug('< ====================== getMemberships ====================== >')
    debug(getMemberships)

    const getMembershipById = await membership.findById(1)
    debug('< ====================== getMembershipById ====================== >')
    debug(getMembershipById)

    // < ========================================== Membership Examples ========================================== />

    // < ============================================ Client Examples ============================================ >
    for (let i = 0; i < clientsList.length; i++) {
      const createOrUpdateClient = await client.createOrUpdate(clientsList[i])
      debug('< ================== Create or update client. ================== >')
      debug(createOrUpdateClient)
    }

    const getClients = await client.findAll()
    debug('< ====================== getClients ====================== >')
    debug(getClients)

    const getClientById = await client.findById(1)
    debug('< ====================== getClientById ====================== >')
    debug(getClientById)

    const getClientByIdNumber = await client.findByIdNumber(111111111)
    debug('< ====================== getClientByIdNumber ====================== >')
    debug(getClientByIdNumber)

    const getClientsByName = await client.findByName('new')
    debug('< ====================== getClientsByName ====================== >')
    debug(getClientsByName)

    const getClientsByPayToday = await client.findByPayToday()
    debug('< ====================== getClientsByPayToday ====================== >')
    debug(getClientsByPayToday)

    const getClientsByPayLate = await client.findByPayLate()
    debug('< ====================== getClientsByPayLate ====================== >')
    debug(getClientsByPayLate)

    // < ============================================ Client Examples ============================================ />

    // < ========================================== Payments Examples ========================================== >
    for (let i = 0; i < paymentsList.length; i++) {
      const createPayment = await payment.create(paymentsList[i])
      debug('< ================== Create or update payment. ================== >')
      debug(createPayment)
    }

    const getPayments = await payment.findAll()
    debug('< ====================== getPayments ====================== >')
    debug(getPayments)

    const getPaymentsToday = await payment.findByPayToday()
    debug('< ====================== getPaymentsToday ====================== >')
    debug(getPaymentsToday)

    const from = moment().subtract(1, 'month').format('YYYY-MM-DD')
    const to = moment().add(1, 'day').format('YYYY-MM-DD')
    const getPaymentsFilter = await payment.findByDate(from, to)
    debug('< ====================== getPaymentsFilter ====================== >')
    debug(getPaymentsFilter)

    // < ========================================== Payments Examples ========================================== />

    process.exit(0)
  } catch (err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(1)
  }
}

run()
