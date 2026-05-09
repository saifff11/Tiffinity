import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import cookRoutes from './routes/cookRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import startCronJobs from './utils/cronJobs.js'


dotenv.config()
connectDB()
startCronJobs()

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/cook', cookRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/menu', menuRoutes)

app.use('/api/orders', orderRoutes)

app.use('/api/reviews', reviewRoutes)
app.use('/api/notifications', notificationRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'TiffinBox API is running' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, '0.0.0.0')