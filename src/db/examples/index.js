import moment from 'moment'
const db = require('../')

const run = async () => {
  const config = {
    database: process.env.DB_NAME || 'gimnasio',
    username: process.env.DB_USER || 'coco',
    password: process.env.DB_PASS || 'coco',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    operatorsAliases: false
  }

  try {
    const { client, membership, user, payment } = await db(config)

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
      profileImageRoute: '../profile/name.png',
      payDay: moment().add(1, 'months').calendar(),
      membershipId: 1
    }

    const clientsList = [
      clientExample,
      { ...clientExample, name: 'Pay today', idNumber: 222222222, payDay: moment().format('L'), membershipId: 2 },
      { ...clientExample, name: 'Late pay', idNumber: 333333333, payDay: moment().subtract(1, 'month').calendar() }
    ]

    const paymentExample = {
      amount: 10000,
      payDay: moment().format('L'),
      date: moment().format('L'),
      clientId: 1,
      userId: 1
    }

    const paymentsList = [
      paymentExample,
      { ...paymentExample, amount: 15000, payDay: moment().subtract(1, 'month').calendar(), clientId: 2, userId: 2 },
      { ...paymentExample, payDay: moment().subtract(7, 'days').calendar(), userId: 2, date: moment().add(1, 'month').calendar() },
      { ...paymentExample, clientId: 2, date: moment().subtract(10, 'days').calendar() }
    ]

    // < ============================================= User Examples ============================================= >
    for (let i = 0; i < usersExamples.length; i++) {
      const createOrUpdateUser = await user.createOrUpdate(usersExamples[i])
      console.log('< ================== Create or update user. ================== >')
      console.log(createOrUpdateUser)
    }

    const getUsers = await user.findAll()
    console.log('< ====================== getUsers ====================== >')
    console.log(getUsers)

    const getUserById = await user.findById(1)
    console.log('< ====================== getUserById ====================== >')
    console.log(getUserById)

    // < ============================================ User Examples ============================================ />

    // < ========================================== Membership Examples ========================================== >
    for (let i = 0; i < membershipsExamples.length; i++) {
      const createOrUpdateMembership = await membership.createOrUpdate(membershipsExamples[i])
      console.log('< ================== Create or update membership. ================== >')
      console.log(createOrUpdateMembership)
    }

    const getMemberships = await membership.findAll()
    console.log('< ====================== getMemberships ====================== >')
    console.log(getMemberships)

    const getMembershipById = await membership.findById(1)
    console.log('< ====================== getMembershipById ====================== >')
    console.log(getMembershipById)

    // < ========================================== Membership Examples ========================================== />

    // < ============================================ Client Examples ============================================ >
    for (let i = 0; i < clientsList.length; i++) {
      const createOrUpdateClient = await client.createOrUpdate(clientsList[i])
      console.log('< ================== Create or update client. ================== >')
      console.log(createOrUpdateClient)
    }

    const getClients = await client.findAll()
    console.log('< ====================== getClients ====================== >')
    console.log(getClients)

    const getClientById = await client.findById(1)
    console.log('< ====================== getClientById ====================== >')
    console.log(getClientById)

    const getClientByIdNumber = await client.findByIdNumber(111111111)
    console.log('< ====================== getClientByIdNumber ====================== >')
    console.log(getClientByIdNumber)

    const getClientsByName = await client.findByName('new')
    console.log('< ====================== getClientsByName ====================== >')
    console.log(getClientsByName)

    // TODO:
    // Fix warning value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date().
    const today = moment().format('L')

    const getClientsByPayToday = await client.findByPayToday(today)
    console.log('< ====================== getClientsByPayToday ====================== >')
    console.log(getClientsByPayToday)

    const getClientsByPayLate = await client.findByPayLate(today)
    console.log('< ====================== getClientsByPayLate ====================== >')
    console.log(getClientsByPayLate)

    // < ============================================ Client Examples ============================================ />

    // < ========================================== Payments Examples ========================================== >
    for (let i = 0; i < paymentsList.length; i++) {
      const createPayment = await payment.create(paymentsList[i])
      console.log('< ================== Create or update payment. ================== >')
      console.log(createPayment)
    }

    const getPayments = await payment.findAll()
    console.log('< ====================== getPayments ====================== >')
    console.log(getPayments)

    const getPaymentsToday = await payment.findByPayToday()
    console.log('< ====================== getPaymentsToday ====================== >')
    console.log(getPaymentsToday)

    const from = moment().subtract(1, 'month').calendar()
    const to = moment().add(1, 'day').calendar()
    const getPaymentsFilter = await payment.findByDate(from, to)
    console.log('< ====================== getPaymentsFilter ====================== >')
    console.log(getPaymentsFilter)

    // < ========================================== Payments Examples ========================================== />

    process.exit(0)
  } catch (err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(1)
  }
}

run()
