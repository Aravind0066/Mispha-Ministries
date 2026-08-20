import { Router, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

export const authRouter = Router()

authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string }

  const adminEmail = (process.env.ADMIN_EMAIL || 'ministriesmispha@gmail.com').trim()
  const adminPassword = (process.env.ADMIN_PASSWORD || '').trim()
  const jwtSecret = process.env.JWT_SECRET || 'mispha-jwt-secret-key-2026'

  if (!adminPassword) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD is not set in Render Environment Variables.' })
  }

  if (email?.trim().toLowerCase() !== adminEmail.toLowerCase() || password?.trim() !== adminPassword) {
    return res.status(401).json({ error: 'Invalid email or password.' })
  }

  const token = jwt.sign({ role: 'admin', email: adminEmail }, jwtSecret, { expiresIn: '7d' })
  return res.json({ token })
})

// Token verification helper used by middleware
export function verifyToken(token: string): { role: string; email: string } | null {
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret-change-in-prod'
    return jwt.verify(token, secret) as { role: string; email: string }
  } catch {
    return null
  }
}
