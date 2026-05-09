import express from 'express'
import {
  createMenu,
  getTodayMenu,
  getMyMenus,
  updateMenu,
  deleteMenu,
  getAllMenus,
  getMenuHistory
} from '../controllers/menuController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

// Public routes
router.get('/all', getAllMenus)
router.get('/today/:cookId', getTodayMenu)

// Cook only routes
router.post('/', protect, authorizeRoles('cook'), createMenu)
router.get('/my', protect, authorizeRoles('cook'), getMyMenus)
router.put('/:id', protect, authorizeRoles('cook'), updateMenu)
router.delete('/:id', protect, authorizeRoles('cook'), deleteMenu)
router.get('/history', protect, authorizeRoles('cook'), getMenuHistory)

export default router