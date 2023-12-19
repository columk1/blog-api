import * as dotenv from 'dotenv'
dotenv.config()
import { connectDb } from './common/models/mongodb.js'
import app from './app.js'

const port = process.env.PORT || 3000

connectDb()

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
