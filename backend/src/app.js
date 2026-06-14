import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import routes from './routes/index.js'
import { notFound, errorHandler } from './middleware/error.js'
import { apiLimiter } from './middleware/rateLimit.js'

const app = express()

// Render / Netlify / any reverse proxy sits in front of this app and sets the
// X-Forwarded-For header. Trusting the first proxy hop lets express-rate-limit
// (and req.ip) read the real client IP instead of throwing ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
app.set('trust proxy', 1)

// Security headers
app.use(helmet())
// CORS — allow the configured frontend origins (comma-separated CLIENT_URL),
// plus any *.netlify.app domain (covers production + deploy previews).
// Trailing slashes are ignored, so CLIENT_URL="https://shegaon.netlify.app/"
// still matches the browser Origin "https://shegaon.netlify.app".
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean)

app.use(
  cors({
    origin(origin, cb) {
      // Requests without an Origin header (curl, server-to-server, health checks).
      if (!origin) return cb(null, true)
      const clean = origin.replace(/\/+$/, '')
      // If CLIENT_URL is not set, don't block anything.
      if (allowedOrigins.length === 0) return cb(null, true)
      if (allowedOrigins.includes(clean)) return cb(null, true)
      if (/\.netlify\.app$/i.test(clean)) return cb(null, true)
      return cb(null, false)
    },
    credentials: true,
  })
)
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'sawta-guest-house-api' }))

// Rate-limited API
app.use('/api', apiLimiter, routes)

// Errors
app.use(notFound)
app.use(errorHandler)

export default app
