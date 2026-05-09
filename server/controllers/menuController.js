import Menu from '../models/Menu.js'
import CookProfile from '../models/CookProfile.js'
import { isCutoffInPast, isCutoffPassed } from '../utils/cutoffTime.js'
import { getTodayDateInIST } from '../utils/timeZone.js'

// Helper — get today's date as "YYYY-MM-DD"
const getTodayDate = () => {
  return getTodayDateInIST()
}

// Helper — validate cutoff time based on meal type
const validateCutoffTime = (mealType, cutoffTime) => {
  const [hours, minutes] = cutoffTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes

  if (mealType === 'lunch' && totalMinutes > 13 * 60) {
    return 'Lunch cutoff time cannot be after 1:00 PM'
  }
  if (mealType === 'dinner' && totalMinutes > 20 * 60) {
    return 'Dinner cutoff time cannot be after 8:00 PM'
  }
  return null
}

// @desc    Cook posts today's menu
// @route   POST /api/menu
export const createMenu = async (req, res) => {
  try {
    const { mealType, dishes, cutoffTime } = req.body

    const cookProfile = await CookProfile.findOne({ userId: req.user.id })
    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' })
    }

    if (!cookProfile.isVerified) {
      return res.status(403).json({ message: 'Your profile is not verified yet' })
    }

    const cutoffError = validateCutoffTime(mealType, cutoffTime)
    if (cutoffError) {
      return res.status(400).json({ message: cutoffError })
    }

    if (isCutoffInPast(cutoffTime)) {
      return res.status(400).json({ message: 'Cutoff time cannot be in the past' })
    }

    const today = getTodayDate()

    const formattedDishes = dishes.map(dish => ({
      ...dish,
      portionsLeft: dish.maxPortions
    }))

    const menu = await Menu.create({
      cookId: cookProfile._id,
      date: today,
      mealType,
      dishes: formattedDishes,
      cutoffTime
    })

    res.status(201).json({ success: true, menu })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get today's menu of a cook
// @route   GET /api/menu/today/:cookId
export const getTodayMenu = async (req, res) => {
  try {
    const today = getTodayDate()
    const menus = await Menu.find({
      cookId: req.params.cookId,
      date: today,
      isActive: true
    })
    res.status(200).json({ success: true, menus })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get cook's own menus
// @route   GET /api/menu/my
export const getMyMenus = async (req, res) => {
  try {
    const cookProfile = await CookProfile.findOne({ userId: req.user.id })
    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' })
    }
    const today = getTodayDate()
    const menus = await Menu.find({ cookId: cookProfile._id, date: today })

    const menusWithExpiry = menus.map(menu => ({
      ...menu.toObject(),
      isExpired: isCutoffPassed(menu.cutoffTime)
    }))

    res.status(200).json({ success: true, menus: menusWithExpiry })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update menu
// @route   PUT /api/menu/:id
export const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' })
    }

    const { dishes, cutoffTime } = req.body

    if (cutoffTime) {
      const cutoffError = validateCutoffTime(menu.mealType, cutoffTime)
      if (cutoffError) {
        return res.status(400).json({ message: cutoffError })
      }

      if (isCutoffInPast(cutoffTime)) {
        return res.status(400).json({ message: 'Cutoff time cannot be in the past' })
      }

      menu.cutoffTime = cutoffTime
    }

    if (dishes) {
      menu.dishes = dishes.map(dish => ({
        ...dish,
        portionsLeft: dish.portionsLeft ?? dish.maxPortions
      }))
    }

    await menu.save()

    res.status(200).json({ success: true, menu })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete menu
// @route   DELETE /api/menu/:id
export const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' })
    }

    await Menu.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, message: 'Menu deleted successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all active menus
// @route   GET /api/menu/all?mealType=lunch
export const getAllMenus = async (req, res) => {
  try {
    const { mealType } = req.query
    const today = getTodayDate()

    const cooks = await CookProfile.find({
      isVerified: true,
      isAvailable: true
    }).populate('userId', 'name')

    const cookIds = cooks.map(c => c._id)

    const menus = await Menu.find({
      cookId: { $in: cookIds },
      date: today,
      isActive: true,
      ...(mealType && { mealType })
    }).populate({
      path: 'cookId',
      populate: { path: 'userId', select: 'name' }
    })

    const activeMenus = menus.filter(menu => !isCutoffPassed(menu.cutoffTime))

    res.status(200).json({ success: true, menus: activeMenus })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get cook's past/expired menus
// @route   GET /api/menu/history
export const getMenuHistory = async (req, res) => {
  try {
    const cookProfile = await CookProfile.findOne({ userId: req.user.id })
    if (!cookProfile) {
      return res.status(404).json({ message: 'Cook profile not found' })
    }

    const today = getTodayDate()

    // Past days menus + today's expired menus
    const allMenus = await Menu.find({ cookId: cookProfile._id })

    const historyMenus = allMenus
      .filter(menu => menu.date < today || (menu.date === today && isCutoffPassed(menu.cutoffTime)))
      .map(menu => ({ ...menu.toObject(), isExpired: true }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    res.status(200).json({ success: true, menus: historyMenus })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}