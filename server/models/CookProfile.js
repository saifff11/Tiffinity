import mongoose from 'mongoose'

const cookProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  cuisineType: [{
    type: String
  }],
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  earnings: {
    total: { type: Number, default: 0 },
    thisMonth: { type: Number, default: 0 },
    thisWeek: { type: Number, default: 0 }
  }
}, { timestamps: true })

export default mongoose.model('CookProfile', cookProfileSchema)