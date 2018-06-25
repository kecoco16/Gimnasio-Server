import path from 'path'

export default router => {
  router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../static', '/index.html'))
  })
}
