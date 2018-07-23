import app from './app'
import chalk from 'chalk'

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`${chalk.blue(`App is running at port ${port}`)}`))
