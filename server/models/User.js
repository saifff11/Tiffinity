import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import CookProfile from './CookProfile.js'


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['customer', 'cook', 'admin'],
    default: 'customer'
  },
  city: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    minlength: 0,
    maxlength: 10,
    unique: true,
  },
  avatar: {
    type: String,
    default: '' //cloudinary Link
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifyOTP: String,
  verifyOTPExpiry: Date,
  resetOTP: String,
  resetOTPExpiry: Date
}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcryptjs.hash(this.password, 10)
})

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password)
}

// Auto delete CookProfile when user is deleted
userSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const CookProfile = (await import('./CookProfile.js')).default
    await CookProfile.deleteOne({ userId: doc._id })
  }
})

export default mongoose.model('User', userSchema)