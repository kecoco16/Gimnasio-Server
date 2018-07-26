export const dbConfig = (debug, setup) => ({
  database: process.env.DB_NAME || 'gimnasio',
  username: process.env.DB_USER || 'coco',
  password: process.env.DB_PASS || 'coco',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: s => debug(s),
  setup,
  operatorsAliases: false,
  timezone: 'America/Costa_Rica'
})

export const jwtSecret = {
  secret: process.env.SECRET || 'coco'
}
