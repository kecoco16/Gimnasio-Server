import chalk from 'chalk'
const app = require('./app')
const port = process.env.PORT || 3000

if (!module.parent) {
  app.listen(port, () => console.log(`${chalk.blue(`App is running at port ${port}`)}`))
}

// The syntax of CommonJS to export modules is required for the integration tests.
module.exports = app
