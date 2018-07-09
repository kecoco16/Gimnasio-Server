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
    const { client, membership } = await db(config)

    const membershipExample = {
      name: 'Normal',
      amount: 15000
    }

    const createOrUpdateMembership = await membership.createOrUpdate(membershipExample)
    console.log('< ================== Create or update membership. ================== >')
    console.log(createOrUpdateMembership)

    const clientExample = {
      idNumber: 111111111,
      name: 'New Client',
      gender: 'M',
      phone: 88888888,
      email: 'test@mail.com',
      profileImageRoute: '../profile/name.png',
      payDay: moment().add(1, 'month').calendar(),
      membershipId: 1
    }

    const clientsList = [
      clientExample,
      { ...clientExample, name: 'Pay today', idNumber: 222222222, payDay: moment().format('L') },
      { ...clientExample, name: 'Late pay', idNumber: 333333333, payDay: moment().subtract(1, 'month').calendar() }
    ]

    for (let i = 0; i < clientsList.length; i++) {
      const createOrUpdateClient = await client.createOrUpdate(clientsList[i])
      console.log('< ================== Create or update client. ================== >')
      console.log(createOrUpdateClient)
    }

    const getClients = await client.findAll()
    console.log('< ====================== getClients ====================== >')
    console.log(getClients)

    const getClientsById = await client.findById(1)
    console.log('< ====================== getClientsById ====================== >')
    console.log(getClientsById)

    const getClientsByIdNumber = await client.findByIdNumber(111111111)
    console.log('< ====================== getClientsByIdNumber ====================== >')
    console.log(getClientsByIdNumber)

    const getClientsByName = await client.findByName('New')
    console.log('< ====================== getClientsName ====================== >')
    console.log(getClientsByName)

    const today = moment().format('L')
    const getClientsByPayToday = await client.findByPayToday(today)
    console.log('< ====================== getClientsByPayToday ====================== >')
    console.log(getClientsByPayToday)

    const getClientsByPayLate = await client.findByPayLate(today)
    console.log('< ====================== getClientsByPayLate ====================== >')
    console.log(getClientsByPayLate)

    process.exit(0)
  } catch (err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(1)
  }
}

run()
