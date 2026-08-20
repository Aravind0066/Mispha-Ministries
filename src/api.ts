// Central API helper.
// In production, prefer VITE_API_URL when provided.
// If omitted, requests use same-origin `/api/*` so Vercel rewrites can proxy to Render.
const DEFAULT_BACKEND_BASE = 'https://mispha-backend-api-2026.onrender.com'

function normalizeBaseUrl(value?: string): string {
  if (!value) return ''

  let normalized = value.trim().replace(/\/+$/, '')
  // Accept either https://host or https://host/api in env configuration.
  normalized = normalized.replace(/\/api$/i, '')

  return normalized
}

const BASE = normalizeBaseUrl(import.meta.env.VITE_API_URL)

function getCandidateEndpoints(path: string): string[] {
  if (path.startsWith('http://') || path.startsWith('https://')) return [path]

  const candidates = [BASE, '', DEFAULT_BACKEND_BASE]
    .map(normalizeBaseUrl)

  const uniqueBases = Array.from(new Set(candidates))
  return uniqueBases.map((base) => `${base}${path}`)
}

function isRedirectStatus(status: number): boolean {
  return status === 301 || status === 302 || status === 307 || status === 308
}

export async function apiFetch<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const { headers, ...rest } = opts
  const endpoints = getCandidateEndpoints(path)
  let lastError: Error | null = null

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i]
    const isLastAttempt = i === endpoints.length - 1

    try {
      const res = await fetch(endpoint, {
        ...rest,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      })

      if (res.ok) {
        return res.json() as Promise<T>
      }

      if (isRedirectStatus(res.status) && !isLastAttempt) {
        continue
      }

      const err = await res
        .json()
        .catch(() => ({ error: res.statusText }))

      const message = err.error || res.statusText || 'API error'

      // Retry likely misrouted attempts (typically from malformed env/base URL).
      const shouldRetry =
        !isLastAttempt &&
        (res.status === 404 || res.status === 405 || (!err.error && !!res.status))

      if (shouldRetry) {
        continue
      }

      throw new Error(message)
    } catch (error: any) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (isLastAttempt) {
        throw lastError
      }
    }
  }

  throw lastError ?? new Error('API error')
}

export function authFetch<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('mispha_admin_token') ?? ''
  const { headers, ...rest } = opts

  return apiFetch<T>(path, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
  })
}

/**
 * Upload a file to Supabase Storage via the backend API.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFile(file: File): Promise<string> {
  const token = localStorage.getItem('mispha_admin_token') ?? ''
  const fd = new FormData()
  fd.append('file', file)

  const res = await fetch(`${BASE}/api/admin/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: fd,
  })

  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Upload failed')
  }

  const data = await res.json() as { url: string }
  return data.url
}