import { Router } from 'express'
import { getMany, getOne, createOne, deleteOne } from './controller.js'

const router = new Router()

router.route('/').get(getMany).post(createOne)

router.route('/:id').get(getOne).delete(deleteOne)

export default router
