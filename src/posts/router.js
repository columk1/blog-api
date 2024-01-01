import { Router } from 'express'
import { getMany, getOne, createOne, updateOne, deleteOne } from './controller.js'
import { authenticate } from '../auth/controller.js'

const router = Router()

router.route('/').get(getMany).post(authenticate, createOne)

router.route('/:id').get(getOne).put(authenticate, updateOne).delete(authenticate, deleteOne)

export default router
