// Central API helper.
// In production, prefer VITE_API_URL when provided.
// If omitted, requests use same-origin `/api/*` so Vercel rewrites can proxy to Render.
function normalizeBaseUrl(value?: string): string {
  if (!value) return ''

  let normalized = value.trim().replace(/\/+$/, '')
  // Accept either https://host or https://host/api in env configuration.
  normalized = normalized.replace(/\/api$/i, '')

  return normalized
}

const BASE = normalizeBaseUrl(import.meta.env.VITE_API_URL)

export async function apiFetch<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const { headers, ...rest } = opts

  const endpoint = path.startsWith('http://') || path.startsWith('https://')
    ? path
    : `${BASE}${path}`

  const res = await fetch(endpoint, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: res.statusText }))

    throw new Error(err.error || 'API error')
  }

  return res.json() as Promise<T>
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