import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const createAdmin = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB Connected')

    const adminExists = await User.findOne({ role: 'admin' })

    if (adminExists) {
      console.log('Admin already exists')
      process.exit()
    }

    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      city: process.env.ADMIN_CITY,
      isVerified: true
    })

    console.log('Admin Created Successfully')
    console.log(admin)

    process.exit()

  } catch (error) {

    console.log('ERROR:')
    console.log(error)

    process.exit(1)
  }
}

createAdmin()