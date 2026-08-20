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

  const supabaseUrl = process.env.SUPABASE_URL || ''
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_PROJECT')) {
    return res.status(500).json({ error: 'Supabase API keys (SUPABASE_URL and SUPABASE_ANON_KEY) must be configured in Render Environment Variables.' })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    })

    if (error || !data.session) {
      return res.status(401).json({ error: error?.message || 'Invalid email or password.' })
    }

    const token = jwt.sign(
      { role: 'admin', email: data.user?.email, sub: data.user?.id },
      jwtSecret,
      { expiresIn: '7d' }
    )

    return res.json({ token, user: data.user })
  } catch (err: any) {
    console.error('Supabase Auth error:', err)
    return res.status(500).json({ error: err.message || 'Authentication failed.' })
  }
})

// Token verification helper used by middleware
export function verifyToken(token: string): { role: string; email: string } | null {
  try {
    return jwt.verify(token, jwtSecret) as { role: string; email: string }
  } catch {
    return null
  }
}

