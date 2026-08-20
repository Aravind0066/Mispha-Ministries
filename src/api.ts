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

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !preset) {
    throw new Error(
      'Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and ' +
      'VITE_CLOUDINARY_UPLOAD_PRESET in .env'
    )
  }

  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', preset)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: fd,
    }
  )

  const data = await res.json() as {
    secure_url?: string
    error?: { message: string }
  }

  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message ?? 'Upload failed')
  }

  return data.secure_url
}

export async function uploadFile(file: File): Promise<string> {
  const token = localStorage.getItem('mispha_admin_token') ?? ''
  const fd = new FormData()

  fd.append('file', file)

  try {
    const res = await fetch(`${BASE}/api/admin/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    })

    if (res.ok) {
      const data = await res.json() as { url: string }
      return `${BASE}${data.url}`
    }

    const err = await res
      .json()
      .catch(() => ({ error: res.statusText }))

    console.warn(
      'Local upload failed on server:',
      err.error || res.statusText
    )
  } catch (err) {
    console.warn('Local upload fetch failed:', err)
  }

  // Use Cloudinary if local server upload fails.
  return uploadToCloudinary(file)
}