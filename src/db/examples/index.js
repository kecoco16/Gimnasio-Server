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
    const { client } = await db(config)

    const clientExample = {
      idNumber: 111111111,
      name: 'Kevin Castillo Mora',
      gender: 'M',
      phone: 88888888,
      email: 'test@mail.com',
      profileImageRoute: '../profile/name.png',
      payDay: new Date(),
      membershipId: null
    }

    const createOrUpdateClient = await client.createOrUpdate(clientExample)
    console.log('< ================== Create or update client. ================== >')
    console.log(createOrUpdateClient)

    const getClients = await client.findAll()
    console.log('< ====================== getClients ====================== >')
    console.log(getClients)

    const getClientsById = await client.findById(1)
    console.log('< ====================== getClientsById ====================== >')
    console.log(getClientsById)

    const getClientsByIdNumber = await client.findByIdNumber(111111111)
    console.log('< ====================== getClientsByIdNumber ====================== >')
    console.log(getClientsByIdNumber)

    const getClientsByIdName = await client.findByName('Kevin Castillo Mora')
    console.log('< ====================== getClientsByIdName ====================== >')
    console.log(getClientsByIdName)

    process.exit(0)
  } catch (err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(1)
  }
}

run()

// const clientsList = [
//   clientBase,
//   { ...clientBase, name: 'Minor Catillo', idNumber: 222222222 },
//   { ...clientBase, name: 'Martha Mora', idNumber: 333333333, gender: 'F' },
//   { ...clientBase, name: 'Michael Catillo', idNumber: 444444444 },
//   { ...clientBase, name: 'Josseline Catillo', idNumber: 555555555, gender: 'F' }
// ]

// await clientsList.map(async c => {
//   const createOrUpdateClient = await client.createOrUpdate(c)
//   return createOrUpdateClient
// })
