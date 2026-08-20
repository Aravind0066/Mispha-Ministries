// Central API helper — uses VITE_API_URL in production,
// or an empty string (Vite proxy) during local development.
const BASE = import.meta.env.VITE_API_URL ?? ''

export async function apiFetch<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const { headers, ...rest } = opts

  const res = await fetch(`${BASE}${path}`, {
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