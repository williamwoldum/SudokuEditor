import express from 'express'
import ViteExpress from 'vite-express'

const app = express()
const port = 8080

ViteExpress.listen(app, port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`)
})
