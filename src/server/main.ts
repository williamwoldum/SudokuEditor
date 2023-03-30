import express from 'express'
import ViteExpress from 'vite-express'
import fs from 'fs'
import path from 'path'

const app = express()
const port = 8080

app.use(express.text())

app.post('/get-sudoku-handler', (_, res) => {
  // Run sdkr validator
  // Run sdkr compiler
  // Respond with proper compilation output

  fs.readFile(path.join(__dirname, '/resources/sampleSdkr.js'), (err, data) => {
    if (err != null) {
      res.status(500).send('Error reading file')
    }
    res.type('application/javascript')
    res.send(data)
  })
})

ViteExpress.listen(app, port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`)
})
