import express from 'express'
import controllers from './controllers/index.mjs'

const authRouter = express.Router()

authRouter.post('/login', controllers.auth.login)
authRouter.post('/logout', controllers.auth.logout)
authRouter.post('/register', controllers.auth.register)

export default authRouter
