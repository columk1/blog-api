import { Router } from 'express'
import {
  getMany,
  getManyPublic,
  getOne,
  createOne,
  updateOne,
  togglePublish,
  deleteOne,
} from './controller.js'
import { authenticate } from '../auth/controller.js'

const router = Router()

router.route('/').get(authenticate, getMany).post(authenticate, createOne)

router.route('/public').get(getManyPublic) // Published posts only

router
  .route('/:id')
  .get(getOne)
  .put(authenticate, updateOne)
  .patch(authenticate, togglePublish)
  .delete(authenticate, deleteOne)

export default router
