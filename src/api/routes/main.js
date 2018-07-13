// Dependencies.
import path from 'path'

export default router => {
  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../static', '/index.html'))
  })
}
