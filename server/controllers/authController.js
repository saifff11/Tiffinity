import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import sendEmail from '../utils/sendEmail.js'
import { generateOTP } from './otpController.js'
import dotenv from 'dotenv'

dotenv.config()

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, city, phone } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    const user = await User.create({
      name, email, password, role, city, phone,
      verifyOTP: otp,
      verifyOTPExpiry: otpExpiry
    })

    void sendEmail(
      email,
      'Verify your TiffinBox account',
      'Welcome to TiffinBox! 👋',
      `
    <p class="text">Hi ${name}, thanks for joining TiffinBox!</p>
    <p class="text">Your verification OTP is:</p>
    <div class="highlight" style="text-align:center;">
      <div style="font-size: 36px; font-weight: 900; color: #047857; letter-spacing: 8px;">${otp}</div>
    </div>
    <p class="text">This OTP expires in <strong>10 minutes</strong>. If you didn't register, ignore this email.</p>
  `
    ).catch(error => {
      console.error('Failed to send registration OTP email:', error.message)
    })

    void sendEmail(
      process.env.ADMIN_EMAIL,
      'New user registered on TiffinBox',
      'New User Alert 🚨',
      `
    <p class="text">A new user has registered on TiffinBox.</p>
    <p class="text">User Details:</p>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Role:</strong> ${role}</li>
      <li><strong>City:</strong> ${city}</li>
      <li><strong>Phone:</strong> ${phone}</li>
    </ul>
  `
    ).catch(error => {
      console.error('Failed to send registration notification email:', error.message)
    })

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please verify your email.',
      email
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check verification BEFORE sending any response
    if (!user.isVerified) {
      // Generate a fresh OTP in case the old one expired
      const otp = generateOTP()
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

      user.verifyOTP = otp
      user.verifyOTPExpiry = otpExpiry
      await user.save()

      void sendEmail(
        email,
        'Verify your TiffinBox account',
        'Your new OTP 🔑',
        `
    <p class="text">Hi ${user.name}, you tried to log in but your email isn't verified yet.</p>
    <p class="text">Your new verification OTP is:</p>
    <div class="highlight" style="text-align:center;">
      <div style="font-size: 36px; font-weight: 900; color: #047857; letter-spacing: 8px;">${otp}</div>
    </div>
    <p class="text">This OTP expires in <strong>10 minutes</strong>.</p>
    `
      ).catch(err => console.error('Failed to resend OTP:', err.message))

      return res.status(403).json({
        message: 'Email not verified. A new OTP has been sent to your email.',
        isVerified: false,
        email   // send email back so frontend can pass it to OTP page
      })
    }

    //  Only send login notification email after all checks pass
    // void sendEmail(
    //   email,
    //   'New login to your TiffinBox account',
    //   'TiffinBox Login Alert 🔔',
    //   `
    //   <p class="text">Hi ${user.name}, a new login was detected on your account.</p>
    //   <p class="text">If this was you, no action is needed.</p>
    //   <p class="text">If you didn't log in, please reset your password immediately.</p>
    //   `
    // ).catch(error => {
    //   console.error('Failed to send login notification email:', error.message)
    // })

    //  Correct 200 status for successful login
    res.status(200).json({
      success: true,
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

// @desc    Get logged in user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}