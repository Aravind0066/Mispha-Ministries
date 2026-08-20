import { Router, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

export const authRouter = Router()

authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string }

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-in-prod'

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ error: 'Admin credentials not configured on server.' })
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid email or password.' })
  }

  const token = jwt.sign({ role: 'admin', email }, jwtSecret, { expiresIn: '7d' })
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
