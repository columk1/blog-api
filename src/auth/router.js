import { Router } from 'express'
import { login } from './controller.js'

const router = new Router()

router.route('/').post(login)

export default router
