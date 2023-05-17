import express from 'express'
import ViteExpress from 'vite-express'
import multer from 'multer'
import { execSync } from 'child_process'
import { randomBytes } from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = 8080
const jrePath = process.env.JRE_PATH ?? 'java'
const compilerPath = './src/server/resources/SdkrCompiler.jar'
const outputPath = './public/Sudoku/'

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'src/server/uploads/')
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

app.post('/upload-sudoku', upload.single('file'), (req, res) => {
  const { file } = req

  if (file === undefined) {
    return res.status(500).send('Server Error')
  }

  try {
    const id = randomBytes(3).toString('hex')
    execSync(
      `${jrePath} -jar ${compilerPath} -i ${file.path} -o ${outputPath}/${id}.js"`
    )
    return res.status(200).send(id)
  } catch (error) {
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.log(`Error: ${error.message}`)
    }
    return res.status(500).send('Server error')
  }
})

ViteExpress.listen(app, port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`)
})
