// DataBase.
import db from './'

// Dependencies.
import inquirer from 'inquirer'
import chalk from 'chalk'
const debug = require('debug')('db:setup')

const prompt = inquirer.createPromptModule()

const setup = async () => {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your database, are you sure?'
    }
  ])

  if (!answer.setup) {
    return console.log('Nothing happened :)')
  }

  const config = {
    database: process.env.DB_NAME || 'gimnasio',
    username: process.env.DB_USER || 'coco',
    password: process.env.DB_PASS || 'coco',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true,
    operatorsAliases: false
  }

  try {
    await db(config)
    console.log('Success!')
    process.exit(0)
  } catch (err) {
    console.error(`${chalk.red('[FATAL ERROR]')} ${chalk.blue(err.message)}`)
    console.error(err.stack)
    process.exit(1)
  }
}

setup()
