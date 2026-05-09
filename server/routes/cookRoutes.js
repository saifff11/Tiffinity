import express from 'express'
import {
  createCookProfile,
  getCookProfile,
  updateCookProfile,
  getAllCooks,
  getSingleCook,
  toggleAvailability
} from '../controllers/cookController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'
import { activeStatus } from '../middleware/activeStatusMiddleware.js'

const router = express.Router()

const handleProfileUpload = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (!err) return next()

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Photo must be 5MB or smaller.' })
    }

    return res.status(400).json({ message: err.message || 'Photo upload failed' })
  })
}

router.get('/all', getAllCooks)
router.get('/:id', getSingleCook)

router.post('/profile', protect, authorizeRoles('cook'), activeStatus, handleProfileUpload, createCookProfile)
router.get('/profile/me', protect, authorizeRoles('cook'), activeStatus, getCookProfile)
router.put('/profile', protect, authorizeRoles('cook'), activeStatus, handleProfileUpload, updateCookProfile)
router.put('/availability', protect, authorizeRoles('cook'), activeStatus, toggleAvailability)

export default router