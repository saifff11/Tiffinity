import express from 'express'
import { submitReview, getCookReviews } from '../controllers/reviewController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/', protect, authorizeRoles('customer'), submitReview)
router.get('/cook/:cookId', getCookReviews)

export default router