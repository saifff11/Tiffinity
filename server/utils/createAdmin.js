import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const adminExists = await User.findOne({ role: 'admin' })
    if (adminExists) {
      process.exit()
    }

    await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      city: process.env.ADMIN_CITY,
      isVerified: true
    })

    process.exit()

  } catch (error) {
    process.exit(1)
  }
}

createAdmin()