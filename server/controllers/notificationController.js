import Notification from '../models/Notification.js'

// @desc    Get all notifications for user
// @route   GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)

    res.status(200).json({ success: true, notifications })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    )
    res.status(200).json({ success: true, message: 'All notifications marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}