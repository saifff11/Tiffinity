import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'order_placed',
      'order_confirmed',
      'order_preparing',
      'order_ready',
      'order_delivered',
      'order_cancelled',
      'cook_approved',
      'cook_profile_submitted'
    ]
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

export default mongoose.model('Notification', notificationSchema)