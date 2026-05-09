import User from '../models/User.js'

export const activeStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        if (!user.isActive) {
            return res.status(403).json({ message: 'Your account has been suspended' })
        }
        next()
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}