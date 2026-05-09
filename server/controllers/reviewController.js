import Review from '../models/Review.js'
import Order from '../models/Order.js'
import CookProfile from '../models/CookProfile.js'

// @desc    Submit review
// @route   POST /api/reviews
export const submitReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body

    // Check order exists and is delivered
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'You can only review delivered orders' })
    }

    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (order.isReviewed) {
      return res.status(400).json({ message: 'You already reviewed this order' })
    }

    // Create review
    const review = await Review.create({
      customerId: req.user.id,
      cookId: order.cookId,
      orderId,
      rating,
      comment
    })

    // Mark order as reviewed
    order.isReviewed = true
    await order.save()

    // Update cook rating
    const allReviews = await Review.find({ cookId: order.cookId })
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await CookProfile.findByIdAndUpdate(order.cookId, {
      rating: avgRating.toFixed(1),
      totalReviews: allReviews.length
    })

    res.status(201).json({ success: true, review })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all reviews of a cook
// @route   GET /api/reviews/cook/:cookId
export const getCookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ cookId: req.params.cookId })
      .populate('customerId', 'name avatar')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, reviews })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}