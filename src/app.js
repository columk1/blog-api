import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookies from 'cookie-parser'
import helmet from 'helmet'

import authRouter from './auth/router.js'
import postsRouter from './posts/router.js'
import commentsRouter from './comments/router.js'

import errorHandler from './common/middleware/error_handler.js'

const app = express()

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4000',
      'https://columk-blog-cms.netlify.app',
      'https://cms.columkelly.com',
      'https://columk.netlify.app',
      'https://columkelly.com',
    ],
    credentials: true,
    exposedHeaders: ['Authorization'],
  })
)

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookies())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)
app.use('/api/comments', commentsRouter)

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Blog API' })
})

// 404
app.use('*', (req, res) => {
  res.status(404)
  throw new Error('Not found')
})

app.use(errorHandler)

export default app
