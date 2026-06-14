import 'dotenv/config'
import app from './app.js'
import connectDB from './config/db.js'
import bootstrap from './config/bootstrap.js'
import { autoCompletePastBookings } from './controllers/bookingController.js'

const PORT = process.env.PORT || 5000

async function start() {
  try {
    await connectDB()
    await bootstrap().catch((e) => console.error('⚠️  Bootstrap warning:', e.message))
    // Finish past-checkout stays now, then sweep every hour so they auto-complete.
    autoCompletePastBookings().catch((e) => console.error('Auto-complete (startup) failed:', e.message))
    setInterval(() => {
      autoCompletePastBookings().catch((e) => console.error('Auto-complete (sweep) failed:', e.message))
    }, 60 * 60 * 1000)
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`))
  } catch (err) {
    console.error('❌ Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
