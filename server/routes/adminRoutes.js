import express from 'express'
import {
  getPendingCooks,
  verifyCook,
  rejectCook,
  getAllUsers,
  getStats,
  banUser,
  getUserDetails
} from '../controllers/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { deleteUser } from '../controllers/adminController.js'


const router = express.Router()

router.use(protect)
router.use(authorizeRoles('admin'))

router.get('/cooks/pending', getPendingCooks)
router.put('/cooks/:id/verify', verifyCook)
router.put('/cooks/:id/reject', rejectCook)
router.get('/users', getAllUsers)
router.get('/stats', getStats)
router.put('/users/:id/ban', banUser)
router.delete('/users/:id', deleteUser)
router.get('/users/:id', getUserDetails)


export default router