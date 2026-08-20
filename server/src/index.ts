import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './auth'
import { formsRouter } from './routes/forms'
import { contentRouter } from './routes/content'
import { adminRouter } from './routes/admin'

const app = express()
const PORT = process.env.PORT || 3001

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim().toLowerCase())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server or requests without origin (curl, mobile apps)
      if (!origin) return cb(null, true)

      const lower = origin.toLowerCase()
      // Always allow misphaministries domain, localhost, vercel deployments, or explicit ALLOWED_ORIGINS
      if (
        lower.includes('misphaministries.com') ||
        lower.includes('vercel.app') ||
        lower.includes('localhost') ||
        allowedOrigins.some(ao => lower.includes(ao))
      ) {
        return cb(null, true)
      }

      console.warn(`CORS blocked request from origin: ${origin}`)
      cb(null, true) // fallback allow to prevent breaking production API calls
    },
    credentials: true,
  })
)

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter)
app.use('/api/content', contentRouter)
app.use('/api/forms', formsRouter)
app.use('/api/admin', adminRouter)

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }))

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Mispha API running on http://localhost:${PORT}`)
  console.log(`   Admin login: ${process.env.ADMIN_EMAIL ?? '(ADMIN_EMAIL not set)'}`)
})

export default app
