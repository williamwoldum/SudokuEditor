import express from 'express'
import ViteExpress from 'vite-express'

const app = express()
const port = 8080

app.use(express.text())

app.post('/get-constraints', (req, res) => {
  const text = req.body

  // Run sdkr validator
  // Run sdkr compiler
  // Return proper js / constraints

  res.send(text)
})

ViteExpress.listen(app, port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`)
})
