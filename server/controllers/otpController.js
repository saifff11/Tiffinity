import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import sendEmail from '../utils/sendEmail.js'

// Generate 6 digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' })
    }

    if (user.verifyOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    if (user.verifyOTPExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired, please register again' })
    }

    user.isVerified = true
    user.verifyOTP = undefined
    user.verifyOTPExpiry = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        isActive: user.isActive
      }
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' })
    }

    const otp = generateOTP()
    user.verifyOTP = otp
    user.verifyOTPExpiry = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    void sendEmail(
      email,
      'Your new TiffinBox OTP',
      'New Verification OTP',
      `
    <p class="text">Your new verification OTP is:</p>
    <div class="highlight" style="text-align:center;">
      <div style="font-size: 36px; font-weight: 900; color: #047857; letter-spacing: 8px;">${otp}</div>
    </div>
    <p class="text">This OTP expires in <strong>10 minutes</strong>.</p>
  `
    ).catch(error => {
      console.error('Failed to send resend OTP email:', error.message)
    })

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email!'
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Forgot password - send OTP
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' })
    }

    // Generate OTP
    const otp = generateOTP()
    user.resetOTP = otp
    user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await user.save()

    // Send email
    void sendEmail(
      email,
      'Reset your TiffinBox password',
      'Password Reset OTP',
      `
    <p class="text">Hi ${user.name}, we received a request to reset your password.</p>
    <p class="text">Your password reset OTP is:</p>
    <div class="highlight" style="text-align:center;">
      <div style="font-size: 36px; font-weight: 900; color: #047857; letter-spacing: 8px;">${otp}</div>
    </div>
    <p class="text">This OTP expires in <strong>10 minutes</strong>. If you didn't request this, ignore this email.</p>
  `
    ).catch(error => {
      console.error('Failed to send forgot-password OTP email:', error.message)
    })

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email!',
      email
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' })
    }

    // Check OTP match
    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    // Check OTP expiry
    if (user.resetOTPExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired, please try again' })
    }

    // Update password
    user.password = newPassword
    user.resetOTP = undefined
    user.resetOTPExpiry = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! Please login with your new password.'
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}