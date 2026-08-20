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
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:8443')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error(`CORS blocked: ${origin}`))
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
