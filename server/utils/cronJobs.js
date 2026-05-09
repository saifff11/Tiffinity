import cron from 'node-cron'
import Menu from '../models/Menu.js'
import { getCurrentTimeInIST, getTodayDateInIST } from './timeZone.js'

const startCronJobs = () => {

  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const currentTime = getCurrentTimeInIST()
      const today = getTodayDateInIST()

      await Menu.updateMany(
        {
          date: today,
          isActive: true,
          cutoffTime: { $lte: currentTime }
        },
        {
          $set: { isActive: false }
        }
      )

    } catch { }
  })
}

export default startCronJobs