import express from 'express'
import routers from './routers/index.mjs'
import middleware from './middleware/index.mjs'
import cors from 'cors'

const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

// initial middleware
app.use(cors(corsOptions))
app.use(express.json())

// routers
app.use('/auth', routers.auth)
app.use('/api', routers.api)
app.use('/admin', routers.admin)

// error middleware
app.use(middleware.genericError)

export default app