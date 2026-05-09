import mongoose from 'mongoose'

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, default: '' },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  maxPortions: { type: Number, required: true },
  portionsLeft: { type: Number, required: true }
})

const menuSchema = new mongoose.Schema({
  cookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CookProfile',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  mealType: {
    type: String,
    enum: ['lunch', 'dinner'],
    required: true
  },
  dishes: [dishSchema],
  cutoffTime: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

export default mongoose.model('Menu', menuSchema)