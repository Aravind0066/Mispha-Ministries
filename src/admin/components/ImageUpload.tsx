import { useState, useCallback } from 'react'
import { uploadFile } from '../../api'

interface Props {
  currentUrl?: string
  onUploaded: (url: string) => void
  label?: string
}

export default function ImageUpload({ currentUrl, onUploaded, label = 'Upload Image' }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(currentUrl || '')

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return }
    setError('')
    setUploading(true)
    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    try {
      const url = await uploadFile(file)
      setPreview(url)
      onUploaded(url)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed'
      setError(msg)
      // If Cloudinary not configured, use local object URL as fallback for demo
      const localUrl = URL.createObjectURL(file)
      setPreview(localUrl)
      onUploaded(localUrl)
    } finally {
      setUploading(false)
    }
  }, [onUploaded])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6E6D' }}>
        {label}
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? '#B5654A' : '#D4CFC5'}`,
          borderRadius: 4,
          padding: preview ? 0 : '32px 16px',
          textAlign: 'center',
          background: dragging ? 'rgba(181,101,74,0.05)' : '#FAFAF8',
          transition: 'all 0.2s',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => document.getElementById('img-file-input')?.click()}
      >
        <input id="img-file-input" type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        {preview ? (
          <>
            <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600,
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
            >
              {uploading ? 'Uploading…' : 'Click to change'}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#9B9E9D' }}>
              {uploading ? 'Uploading…' : 'Drag & drop or click to upload'}
            </div>
          </>
        )}
      </div>
      {error && <div style={{ marginTop: 6, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#C0392B' }}>{error}</div>}
    </div>
  )
}
