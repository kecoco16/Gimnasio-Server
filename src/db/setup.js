// DataBase.
import db from './'
import { dbConfig } from '../commond/setup'

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
    return console.log(`${chalk.blue('Nothing happened :)')}`)
  }

  try {
    await db(dbConfig(debug, true))
    console.log(`${chalk.green('Success!')}`)
    process.exit(0)
  } catch (err) {
    console.error(`${chalk.red('[FATAL ERROR]')} ${chalk.blue(err.message)}`)
    console.error(err.stack)
    process.exit(1)
  }
}

setup()
