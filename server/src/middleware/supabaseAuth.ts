import { createClient } from '@supabase/supabase-js';
import type { Request, Response, NextFunction } from 'express';

// Initialise Supabase client with service role key (server‑side only)
const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
);

/**
 * Middleware that validates a Supabase JWT provided in the `Authorization` header.
 * If the token is valid, `req.supabaseUser` will contain the user payload.
 */
export async function supabaseAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.slice(7);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  // Attach user object for downstream handlers (type any to avoid TS config changes)
  (req as any).supabaseUser = data.user;
  next();
}
