import User from '../models/User.js'
import CookProfile from '../models/CookProfile.js'
import sendEmail from '../utils/sendEmail.js'
import Order from '../models/Order.js'
import Menu from '../models/Menu.js'
import Review from '../models/Review.js'
import mongoose from 'mongoose'
import Notification from '../models/Notification.js'

// @desc    Get all pending cooks
// @route   GET /api/admin/cooks/pending
export const getPendingCooks = async (req, res) => {
  try {
    const pendingCooks = await CookProfile.find({ isVerified: false })
      .populate('userId', 'name email city createdAt')

    res.status(200).json({ success: true, pendingCooks })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Approve cook
// @route   PUT /api/admin/cooks/:id/verify
export const verifyCook = async (req, res) => {
  try {
    const cookProfile = await CookProfile.findById(req.params.id)
      .populate('userId', 'name email')

    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook not found' })
    }

    cookProfile.isVerified = true
    await cookProfile.save()

    // Send approval email without blocking the admin action.
    void sendEmail(
      cookProfile.userId.email,
      'Your Tiffinity cook profile is approved! 🎉',
      'You are approved! 🎉',
      `
    <p class="text">Congratulations ${cookProfile.userId.name}!</p>
    <p class="text">Your cook profile has been <strong>approved</strong> by the Tiffinity team. You can now start posting your daily menu and accepting orders.</p>
    <p class="text">Welcome to the Tiffinity family! </p>
  `
    ).catch(error => {
      console.error('Failed to send cook approval email:', error.message)
    })

    res.status(200).json({ success: true, message: 'Cook approved successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Reject cook
// @route   PUT /api/admin/cooks/:id/reject
export const rejectCook = async (req, res) => {
  try {
    const { reason } = req.body

    const cookProfile = await CookProfile.findById(req.params.id)
      .populate('userId', 'name email')

    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook not found' })
    }

    // Send rejection email without blocking profile rejection.
    void sendEmail(
      cookProfile.userId.email,
      'Tiffinity cook profile update',
      'Profile Not Approved',
      `
    <p class="text">Hi ${cookProfile.userId.name},</p>
    <p class="text">Unfortunately your cook profile was not approved at this time.</p>
    <div class="highlight">
      <div class="highlight-row">
        <span class="highlight-label">Reason</span>
        <span class="highlight-value">${reason || 'Profile information incomplete'}</span>
      </div>
    </div>
    <p class="text">You can update your profile and apply again. We'd love to have you on board!</p>
  `
    ).catch(error => {
      console.error('Failed to send cook rejection email:', error.message)
    })
    await CookProfile.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, message: 'Cook rejected and notified' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json({ success: true, users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get platform stats
// @route   GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 6)
    startDate.setHours(0, 0, 0, 0)

    const [
      totalUsers,
      totalCooks,
      pendingCooks,
      totalOrders,
      activeOrders,
      deliveredOrders,
      cancelledOrders,
      paidOrders,
      revenueResult,
      statusBreakdown,
      paymentBreakdown,
      roleBreakdown,
      cityBreakdown,
      mealTypeBreakdown,
      last7DaysOrders
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      CookProfile.countDocuments({ isVerified: true }),
      CookProfile.countDocuments({ isVerified: false }),
      Order.countDocuments(),
      Order.countDocuments({
        status: { $in: ['pending', 'confirmed', 'preparing', 'ready'] }
      }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.countDocuments({ paymentStatus: 'paid' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Order.aggregate([
        { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      User.aggregate([
        { $match: { city: { $ne: null } } },
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 }
      ]),
      Order.aggregate([
        {
          $lookup: {
            from: 'menus',
            localField: 'menuId',
            foreignField: '_id',
            as: 'menu'
          }
        },
        { $unwind: { path: '$menu', preserveNullAndEmptyArrays: true } },
        { $group: { _id: '$menu.mealType', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
        { $sort: { count: -1 } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0]
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ])

    const last7Days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + index)
      const key = date.toISOString().slice(0, 10)
      const found = last7DaysOrders.find(item => item._id === key)

      return {
        date: key,
        label: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        orders: found?.orders || 0,
        revenue: found?.revenue || 0
      }
    })

    const totalRevenue = revenueResult[0]?.total || 0
    const completionRate = totalOrders ? Math.round((deliveredOrders / totalOrders) * 100) : 0
    const cancellationRate = totalOrders ? Math.round((cancelledOrders / totalOrders) * 100) : 0

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCooks,
        pendingCooks,
        totalOrders,
        activeOrders,
        deliveredOrders,
        cancelledOrders,
        paidOrders,
        totalRevenue,
        completionRate,
        cancellationRate,
        analytics: {
          statusBreakdown,
          paymentBreakdown,
          roleBreakdown,
          cityBreakdown,
          mealTypeBreakdown,
          last7Days
        }
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all orders with admin filters
// @route   GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      mealType,
      city,
      search,
      dateFrom,
      dateTo
    } = req.query

    const query = {}

    if (status && status !== 'all') query.status = status
    if (paymentStatus && paymentStatus !== 'all') query.paymentStatus = paymentStatus

    if (dateFrom || dateTo) {
      query.createdAt = {}
      if (dateFrom) query.createdAt.$gte = new Date(`${dateFrom}T00:00:00.000Z`)
      if (dateTo) query.createdAt.$lte = new Date(`${dateTo}T23:59:59.999Z`)
    }

    let orders = await Order.find(query)
      .populate('customerId', 'name email phone city')
      .populate({
        path: 'cookId',
        select: 'city address cuisineType photo rating',
        populate: { path: 'userId', select: 'name email phone city' }
      })
      .populate('menuId', 'date mealType cutoffTime')
      .sort({ createdAt: -1 })

    if (mealType && mealType !== 'all') {
      orders = orders.filter(order => order.menuId?.mealType === mealType)
    }

    if (city?.trim()) {
      const cityRegex = new RegExp(city.trim(), 'i')
      orders = orders.filter(order =>
        cityRegex.test(order.customerId?.city || '') ||
        cityRegex.test(order.cookId?.city || '') ||
        cityRegex.test(order.cookId?.userId?.city || '')
      )
    }

    if (search?.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i')
      orders = orders.filter(order =>
        searchRegex.test(order.dish?.name || '') ||
        searchRegex.test(order.customerId?.name || '') ||
        searchRegex.test(order.customerId?.email || '') ||
        searchRegex.test(order.cookId?.userId?.name || '') ||
        searchRegex.test(order.cookId?.userId?.email || '') ||
        searchRegex.test(order.paymentId || '') ||
        searchRegex.test(order._id.toString())
      )
    }

    const summary = {
      total: orders.length,
      active: orders.filter(order => ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)).length,
      delivered: orders.filter(order => order.status === 'delivered').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length,
      paid: orders.filter(order => order.paymentStatus === 'paid').length,
      revenue: orders
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.totalAmount, 0)
    }

    res.status(200).json({ success: true, orders, summary })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/// @desc    Ban user
// @route   PUT /api/admin/users/:id/ban
export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // user.isActive = !user.isActive
    // await user.save()

    const isActiveStatus = !user.isActive;
    await User.findByIdAndUpdate(req.params.id, { isActive: isActiveStatus });

    res.status(200).json({
      success: true,
      message: `User ${isActiveStatus ? 'unbanned' : 'banned'} successfully`
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Delete cook profile if exists
    await CookProfile.deleteOne({ userId: req.params.id })

    // Delete user
    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'User and related data deleted successfully'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get user details (admin)
// @route   GET /api/admin/users/:id
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Get user
    const user = await User.findById(userId).select("-password -verifyOTP -verifyOTPExpiry -resetOTP -resetOTPExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Fetch base data in parallel
    const [cookProfile, customerOrders, reviews, notifications] = await Promise.all([
      CookProfile.findOne({ userId }),

      Order.find({ customerId: userId })
        .populate("menuId", "title mealType date")
        .populate({
          path: "cookId",
          select: "city rating",
          populate: { path: "userId", select: "name avatar" }
        })
        .sort({ createdAt: -1 })
        .limit(10),

      Review.find({ customerId: userId })
        .populate({
          path: "cookId",
          select: "city photo rating",
          populate: { path: "userId", select: "name avatar" }
        })
        .populate("orderId", "dish totalAmount createdAt")
        .sort({ createdAt: -1 })
        .limit(10),

      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    let menus = [];
    let cookOrders = [];
    let cookReceivedReviews = [];

    // 3. If user is cook → fetch menus + orders received
    if (user.role === "cook" && cookProfile) {
      const cookId = cookProfile._id;

      const [fetchedMenus, fetchedCookOrders, fetchedCookReceivedReviews] = await Promise.all([
        Menu.find({ cookId })
          .sort({ createdAt: -1 })
          .limit(10),

        Order.find({ cookId })
          .populate("customerId", "name avatar city")
          .populate("menuId", "title mealType date")
          .sort({ createdAt: -1 })
          .limit(10),

        Review.find({ cookId })
          .populate("customerId", "name avatar city")
          .populate("orderId", "dish totalAmount createdAt")
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

      menus = fetchedMenus;
      cookOrders = fetchedCookOrders;
      cookReceivedReviews = fetchedCookReceivedReviews;
    }

    // 4. Order stats
    const totalOrders = customerOrders.length;
    const deliveredOrders = customerOrders.filter(o => o.status === "delivered").length;
    const cancelledOrders = customerOrders.filter(o => o.status === "cancelled").length;
    const pendingOrders = customerOrders.filter(o => o.status === "pending").length;

    // 5. Cook order stats (if cook)
    const cookOrderStats = user.role === "cook" ? {
      total: cookOrders.length,
      delivered: cookOrders.filter(o => o.status === "delivered").length,
      cancelled: cookOrders.filter(o => o.status === "cancelled").length,
      pending: cookOrders.filter(o => o.status === "pending").length,
    } : null;

    res.status(200).json({
      success: true,
      data: {
        user,
        cookProfile,
        orders: {
          recent: customerOrders,
          stats: { totalOrders, deliveredOrders, cancelledOrders, pendingOrders },
        },
        cookData: {
          menus,
          orders: cookOrders,
          stats: cookOrderStats,
          receivedReviews: cookReceivedReviews,
        },
        reviews,
        notifications,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
