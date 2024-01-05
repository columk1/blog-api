import { Router } from 'express'
import { getMany, getOne, createOne, updateOne, togglePublish, deleteOne } from './controller.js'
import { authenticate } from '../auth/controller.js'

const router = Router()

router.route('/').get(getMany).post(authenticate, createOne)

router
  .route('/:id')
  .get(getOne)
  .put(authenticate, updateOne)
  .patch(authenticate, togglePublish)
  .delete(authenticate, deleteOne)

export default router
