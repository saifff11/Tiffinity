import express from 'express'
import {
  placeOrder,
  getMyOrders,
  getCookOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/', protect, authorizeRoles('customer'), placeOrder)
router.get('/my', protect, authorizeRoles('customer'), getMyOrders)
router.get('/cook', protect, authorizeRoles('cook'), getCookOrders)
router.put('/:id/status', protect, authorizeRoles('cook'), updateOrderStatus)
router.put('/:id/cancel', protect, authorizeRoles('customer'), cancelOrder)

export default router