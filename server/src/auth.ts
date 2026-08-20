import { Router, type Request, type Response } from 'express'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

export const authRouter = Router()

const jwtSecret = process.env.JWT_SECRET || 'mispha-jwt-secret-key-2026'

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  const cleanEmail = email.trim().toLowerCase()
  const cleanPass = password.trim()

  // 1. Attempt Supabase Auth login if SUPABASE_URL & SUPABASE_ANON_KEY are configured
  const supabaseUrl = process.env.SUPABASE_URL || ''
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_PROJECT')) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      })

      if (!error && data.session) {
        const token = jwt.sign(
          { role: 'admin', email: data.user?.email || cleanEmail, sub: data.user?.id },
          jwtSecret,
          { expiresIn: '7d' }
        )
        return res.json({ token, user: data.user })
      }
    } catch (err) {
      console.error('Supabase Auth error:', err)
    }
  }

  // 2. Fallback check: ADMIN_EMAIL & ADMIN_PASSWORD env vars
  const adminEmail = (process.env.ADMIN_EMAIL || 'ministriesmispha@gmail.com').trim().toLowerCase()
  const adminPassword = (process.env.ADMIN_PASSWORD || '').trim()

  if (adminPassword && cleanEmail === adminEmail && cleanPass === adminPassword) {
    const token = jwt.sign({ role: 'admin', email: adminEmail }, jwtSecret, { expiresIn: '7d' })
    return res.json({ token })
  }

  return res.status(401).json({ error: 'Invalid email or password. Please check your credentials or Supabase user setup.' })
})

// Token verification helper used by middleware
export function verifyToken(token: string): { role: string; email: string } | null {
  try {
    return jwt.verify(token, jwtSecret) as { role: string; email: string }
  } catch {
    return null
  }
}

