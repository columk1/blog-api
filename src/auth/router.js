import { Router } from 'express'
import { login, refresh } from './controller.js'

const router = new Router()

router.route('/login').post(login)
router.route('/refresh').post(refresh)

export default router
