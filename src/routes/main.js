export default router => {
  router.get('/', async (req, res) => {
    res.send('Hello word')
  })
}
