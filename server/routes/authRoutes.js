import express from 'express'
import { register, login, getMe } from '../controllers/authController.js'
import { verifyOTP, resendOTP, forgotPassword, resetPassword } from '../controllers/otpController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify-otp', verifyOTP)
router.post('/resend-otp', resendOTP)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/me', protect, getMe)

export default router