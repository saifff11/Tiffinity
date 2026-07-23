import Order from '../models/Order.js'
import Menu from '../models/Menu.js'
import CookProfile from '../models/CookProfile.js'
import sendEmail from '../utils/sendEmail.js'
import Notification from '../models/Notification.js'
import Review from '../models/Review.js'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { isCutoffPassed } from '../utils/cutoffTime.js'
import {
  getStartOfCurrentMonthInISTAsUTCDate,
  getStartOfCurrentWeekInISTAsUTCDate
} from '../utils/timeZone.js'

const getRazorpayInstance = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are missing in server/.env')
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  })
}

const restoreOrderPortions = async (order) => {
  const menu = await Menu.findById(order.menuId)
  if (!menu) return

  const dish = menu.dishes.find(d => d.name === order.dish.name)
  if (!dish) return

  dish.portionsLeft += order.quantity
  menu.isActive = true
  await menu.save()
}

// @desc    Create order and Razorpay checkout order
// @route   POST /api/orders
export const placeOrder = async (req, res) => {
  let pendingOrder

  try {
    const { menuId, dishIndex, quantity, deliveryAddress } = req.body
    const razorpay = getRazorpayInstance()

    const menu = await Menu.findById(menuId)
    if (!menu) return res.status(404).json({ message: 'Menu not found' })

    if (isCutoffPassed(menu.cutoffTime)) {
      return res.status(400).json({ message: 'Order cutoff time has passed' })
    }

    const dish = menu.dishes[dishIndex]
    if (!dish) return res.status(404).json({ message: 'Dish not found' })

    if (dish.portionsLeft < quantity) {
      return res.status(400).json({
        message: `Only ${dish.portionsLeft} portions left`
      })
    }

    const totalAmount = dish.price * quantity

    menu.dishes[dishIndex].portionsLeft -= quantity

    const allDishesEmpty = menu.dishes.every(d => d.portionsLeft <= 0)
    if (allDishesEmpty) menu.isActive = false

    await menu.save()

    const order = await Order.create({
      customerId: req.user.id,
      cookId: menu.cookId,
      menuId,
      dish: {
        name: dish.name,
        photo: dish.photo,
        price: dish.price
      },
      quantity,
      totalAmount,
      deliveryAddress,
      status: 'pending',
      paymentStatus: 'pending'
    })
    pendingOrder = order

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: order._id.toString(),
      notes: {
        tiffinityOrderId: order._id.toString(),
        customerId: req.user.id
      }
    })

    order.razorpayOrderId = razorpayOrder.id
    await order.save()

    res.status(201).json({
      success: true,
      message: 'Razorpay order created successfully!',
      order,
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    if (pendingOrder) {
      pendingOrder.status = 'cancelled'
      pendingOrder.paymentStatus = 'failed'
      await pendingOrder.save()
      await restoreOrderPortions(pendingOrder)
    }

    res.status(500).json({ message: error.message })
  }
}

// Legacy COD flow kept for reference while Razorpay is the active checkout path.
const legacyPlaceOrder = async (req, res) => {
  try {
    const { menuId, dishIndex, quantity, deliveryAddress } = req.body

    const menu = await Menu.findById(menuId)
    if (!menu) return res.status(404).json({ message: 'Menu not found' })

    if (isCutoffPassed(menu.cutoffTime)) {
      return res.status(400).json({ message: 'Order cutoff time has passed' })
    }

    const dish = menu.dishes[dishIndex]
    if (!dish) return res.status(404).json({ message: 'Dish not found' })

    if (dish.portionsLeft < quantity) {
      return res.status(400).json({
        message: `Only ${dish.portionsLeft} portions left`
      })
    }

    const totalAmount = dish.price * quantity

    menu.dishes[dishIndex].portionsLeft -= quantity

    const allDishesEmpty = menu.dishes.every(d => d.portionsLeft <= 0)
    if (allDishesEmpty) menu.isActive = false

    await menu.save()

    const order = await Order.create({
      customerId: req.user.id,
      cookId: menu.cookId,
      menuId,
      dish: {
        name: dish.name,
        photo: dish.photo,
        price: dish.price
      },
      quantity,
      totalAmount,
      deliveryAddress,
      status: 'confirmed',
      paymentStatus: 'pending'
    })

    // Get cook data FIRST then use it
    const cookData = await CookProfile.findById(menu.cookId)
      .populate('userId', 'name email')

    // Now create notification using cookData
    await Notification.create({
      userId: cookData.userId._id,
      message: `New order received for ${dish.name}!`,
      type: 'order_placed'
    })

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    })

    // Send email after the API response so a slow SMTP provider cannot block checkout.
    void sendEmail(
      cookData.userId.email,
      'New order received! ',
      'You have a new order!',
      `
    <p class="text">Hi ${cookData.userId.name}, you have a new order on Tiffinity!</p>
    <div class="highlight">
      <div class="highlight-row"><span class="highlight-label">Dish:&nbsp;</span><span class="highlight-value">${dish.name}</span></div>
      <div class="highlight-row"><span class="highlight-label">Quantity:&nbsp;</span><span class="highlight-value">${quantity}</span></div>
      <div class="highlight-row"><span class="highlight-label">Amount:&nbsp;</span><span class="highlight-value">₹${totalAmount} (COD)</span></div>
      <div class="highlight-row"><span class="highlight-label">Delivery Address:&nbsp;</span><span class="highlight-value">${deliveryAddress}</span></div>
    </div>
    <p class="text">Please prepare the order on time.</p>
  `
    ).catch(error => {
      console.error('Failed to send cook order email:', error.message)
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Verify Razorpay payment and confirm order
// @route   POST /api/orders/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (order.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        order
      })
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      order.paymentStatus = 'failed'
      order.status = 'cancelled'
      await order.save()
      await restoreOrderPortions(order)
      return res.status(400).json({ message: 'Invalid Razorpay order id' })
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'failed'
      order.status = 'cancelled'
      await order.save()
      await restoreOrderPortions(order)
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    order.paymentStatus = 'paid'
    order.status = 'pending'
    order.paymentId = razorpay_payment_id
    order.razorpaySignature = razorpay_signature
    await order.save()

    const cookData = await CookProfile.findById(order.cookId)
      .populate('userId', 'name email')

    if (cookData?.userId) {
      await Notification.create({
        userId: cookData.userId._id,
        message: `New paid order for ${order.dish.name} is waiting for your acceptance.`,
        type: 'order_placed'
      })

      void sendEmail(
        cookData.userId.email,
        'New order received! ',
        'You have a new order!',
        `
    <p class="text">Hi ${cookData.userId.name}, you have a new paid order on Tiffinity waiting for your acceptance.</p>
    <div class="highlight">
      <div class="highlight-row"><span class="highlight-label">Dish:&nbsp;</span><span class="highlight-value">${order.dish.name}</span></div>
      <div class="highlight-row"><span class="highlight-label">Quantity:&nbsp;</span><span class="highlight-value">${order.quantity}</span></div>
      <div class="highlight-row"><span class="highlight-label">Amount:&nbsp;</span><span class="highlight-value">Rs.${order.totalAmount} (Paid online)</span></div>
      <div class="highlight-row"><span class="highlight-label">Delivery Address:&nbsp;</span><span class="highlight-value">${order.deliveryAddress}</span></div>
    </div>
    <p class="text">Please prepare the order on time.</p>
  `
      ).catch(error => {
        console.error('Failed to send cook order email:', error.message)
      })
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified! Waiting for cook acceptance.',
      order
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get customer orders
// @route   GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .populate('cookId')
      .sort({ createdAt: -1 })

    const orderIds = orders.map(o => o._id)
    const reviews = await Review.find({ orderId: { $in: orderIds } })

    const ordersWithReview = orders.map(order => {
      const review = reviews.find(r => r.orderId.toString() === order._id.toString())
      return { ...order.toObject(), review: review || null }
    })

    res.status(200).json({ success: true, orders: ordersWithReview })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get cook incoming orders
// @route   GET /api/orders/cook
export const getCookOrders = async (req, res) => {
  try {
    const cookProfile = await CookProfile.findOne({ userId: req.user.id })
    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' })
    }

    const orders = await Order.find({ cookId: cookProfile._id })
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Cook accepts a paid pending order
// @route   PUT /api/orders/:id/accept
export const acceptOrder = async (req, res) => {
  try {
    const cookProfile = await CookProfile.findOne({ userId: req.user.id })
    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' })
    }

    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.cookId.toString() !== cookProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this order' })
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Only paid orders can be accepted' })
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: `Order is already ${order.status}` })
    }

    order.status = 'confirmed'
    order.acceptedAt = new Date()
    await order.save()

    await Notification.create({
      userId: order.customerId._id,
      message: `Your order for ${order.dish.name} was accepted by the cook!`,
      type: 'order_confirmed'
    })

    res.status(200).json({
      success: true,
      message: 'Order accepted successfully',
      order
    })

    void sendEmail(
      order.customerId.email,
      'Your Tiffinity order was accepted!',
      'Order Accepted',
      `
    <p class="text">Hi ${order.customerId.name},</p>
    <p class="text">Good news! Your cook accepted the order for <strong>${order.dish.name}</strong>.</p>
    <div class="highlight">
      <div class="highlight-row"><span class="highlight-label">Quantity:&nbsp;</span><span class="highlight-value">${order.quantity}</span></div>
      <div class="highlight-row"><span class="highlight-label">Amount:&nbsp;</span><span class="highlight-value">Rs.${order.totalAmount}</span></div>
      <div class="highlight-row"><span class="highlight-label">Status:&nbsp;</span><span class="highlight-value">CONFIRMED</span></div>
    </div>
    <p class="text">The cook will start preparing it soon.</p>
  `
    ).catch(error => {
      console.error('Failed to send accepted order email:', error.message)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Cook rejects a paid pending order
// @route   PUT /api/orders/:id/reject
export const rejectOrder = async (req, res) => {
  try {
    const { reason } = req.body

    const cookProfile = await CookProfile.findOne({ userId: req.user.id })
    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' })
    }

    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.cookId.toString() !== cookProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this order' })
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: `Only pending orders can be rejected. This order is ${order.status}` })
    }

    order.status = 'cancelled'
    order.rejectedAt = new Date()
    order.rejectionReason = reason || 'Cook is unable to prepare this order'
    await order.save()
    await restoreOrderPortions(order)

    await Notification.create({
      userId: order.customerId._id,
      message: `Your order for ${order.dish.name} was rejected by the cook.`,
      type: 'order_cancelled'
    })

    res.status(200).json({
      success: true,
      message: 'Order rejected successfully',
      order
    })

    void sendEmail(
      order.customerId.email,
      'Your Tiffinity order was rejected',
      'Order Rejected',
      `
    <p class="text">Hi ${order.customerId.name},</p>
    <p class="text">Unfortunately, the cook could not accept your order for <strong>${order.dish.name}</strong>.</p>
    <div class="highlight">
      <div class="highlight-row"><span class="highlight-label">Reason:&nbsp;</span><span class="highlight-value">${order.rejectionReason}</span></div>
      <div class="highlight-row"><span class="highlight-label">Amount:&nbsp;</span><span class="highlight-value">Rs.${order.totalAmount}</span></div>
    </div>
    <p class="text">If payment was captured, please contact support for refund processing.</p>
  `
    ).catch(error => {
      console.error('Failed to send rejected order email:', error.message)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body

    const allowedStatusUpdates = ['preparing', 'ready', 'delivered', 'cancelled']
    if (!allowedStatusUpdates.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status update' })
    }

    const cookProfile = await CookProfile.findOne({ userId: req.user.id })
    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' })
    }

    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.cookId.toString() !== cookProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this order' })
    }

    if (order.status === 'pending') {
      return res.status(400).json({ message: 'Accept or reject this order first' })
    }

    if (order.paymentStatus !== 'paid' && status !== 'cancelled') {
      return res.status(400).json({ message: 'Payment must be completed before updating order status' })
    }

    const validTransitions = {
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['delivered'],
      delivered: [],
      cancelled: []
    }

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot change order from ${order.status} to ${status}`
      })
    }

    order.status = status
    await order.save()

    // Update cook earnings when delivered
    if (status === 'delivered') {
      const startOfWeek = getStartOfCurrentWeekInISTAsUTCDate()
      const startOfMonth = getStartOfCurrentMonthInISTAsUTCDate()

      const allDelivered = await Order.find({
        cookId: order.cookId,
        status: 'delivered'
      })

      const thisWeekOrders = allDelivered.filter(o => new Date(o.createdAt) >= startOfWeek)
      const thisMonthOrders = allDelivered.filter(o => new Date(o.createdAt) >= startOfMonth)

      const totalEarnings = allDelivered.reduce((sum, o) => sum + o.totalAmount, 0)
      const weekEarnings = thisWeekOrders.reduce((sum, o) => sum + o.totalAmount, 0)
      const monthEarnings = thisMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0)

      await CookProfile.findByIdAndUpdate(order.cookId, {
        'earnings.total': totalEarnings,
        'earnings.thisWeek': weekEarnings,
        'earnings.thisMonth': monthEarnings
      })
    }

    // Create notification for customer
    await Notification.create({
      userId: order.customerId._id,
      message: `Your order for ${order.dish.name} is now ${status}!`,
      type: `order_${status}`
    })

    res.status(200).json({ success: true, order })

    // Send email after the API response so order status updates are not blocked by SMTP issues.
    void sendEmail(
      order.customerId.email,
      `Your Tiffinity order is ${status}!`,
      `Order ${status.charAt(0).toUpperCase() + status.slice(1)}!`,
      `
    <p class="text">Hi ${order.customerId.name},</p>
    <div class="highlight">
      <div class="highlight-row"><span class="highlight-label">Dish:&nbsp;</span><span class="highlight-value">${order.dish.name}</span></div>
      <div class="highlight-row"><span class="highlight-label">Status:&nbsp;</span><span class="highlight-value" style="color: #047857;">${status.toUpperCase()}</span></div>
      <div class="highlight-row"><span class="highlight-label">Amount:&nbsp;</span><span class="highlight-value">₹${order.totalAmount}</span></div>
    </div>
    ${status === 'delivered'
        ? '<p class="text">Enjoy your meal! Don\'t forget to leave a review. 😊</p>'
        : '<p class="text">We\'ll keep you updated as your order progresses!</p>'
      }
  `
    ).catch(error => {
      console.error('Failed to send customer status email:', error.message)
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' })
    }

    order.status = 'cancelled'
    if (order.paymentStatus === 'pending') {
      order.paymentStatus = 'failed'
    }
    await order.save()

    await restoreOrderPortions(order)

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully'
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
