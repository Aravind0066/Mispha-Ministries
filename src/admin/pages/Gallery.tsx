import { useState, useEffect } from 'react'
import { authFetch } from '../../api'
import ImageUpload from '../components/ImageUpload'

export default function Gallery() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)

  const load = () => authFetch<any[]>('/api/admin/gallery').then(setItems).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing.id) {
      await authFetch(`/api/admin/gallery/${editing.id}`, { method: 'PUT', body: JSON.stringify(editing) })
    } else {
      await authFetch('/api/admin/gallery', { method: 'POST', body: JSON.stringify(editing) })
    }
    setEditing(null)
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this image?')) return
    await authFetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, margin: 0 }}>Gallery</h1>
        <button onClick={() => setEditing({ title: '', occasion: '', location: '', participants: '', detail: '', url: '', sortOrder: 0 })}
          style={{ padding: '10px 20px', background: '#B5654A', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          + Add Image
        </button>
      </div>

      {loading ? <div>Loading...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #E5E2DA' }}>
              <img src={item.url} alt={item.title} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 11, color: '#B5654A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{item.occasion}</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, margin: '0 0 12px 0' }}>{item.title}</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setEditing(item)} style={{ flex: 1, padding: 8, background: '#F4F0E8', border: 'none', cursor: 'pointer', fontSize: 12 }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: 8, background: '#FDF0ED', color: '#C0392B', border: 'none', cursor: 'pointer', fontSize: 12 }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: 32, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", marginTop: 0 }}>{editing.id ? 'Edit Image' : 'New Image'}</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <ImageUpload currentUrl={editing.url} onUploaded={url => setEditing({ ...editing, url })} />
              <input placeholder="Title" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} required style={{ padding: 12, border: '1px solid #D4CFC5' }} />
              <input placeholder="Occasion" value={editing.occasion} onChange={e => setEditing({ ...editing, occasion: e.target.value })} style={{ padding: 12, border: '1px solid #D4CFC5' }} />
              <input placeholder="Location" value={editing.location} onChange={e => setEditing({ ...editing, location: e.target.value })} style={{ padding: 12, border: '1px solid #D4CFC5' }} />
              <input placeholder="Participants" value={editing.participants} onChange={e => setEditing({ ...editing, participants: e.target.value })} style={{ padding: 12, border: '1px solid #D4CFC5' }} />
              <textarea placeholder="Detail description" value={editing.detail} onChange={e => setEditing({ ...editing, detail: e.target.value })} rows={4} style={{ padding: 12, border: '1px solid #D4CFC5', resize: 'vertical' }} />
              <input type="number" placeholder="Sort Order" value={editing.sortOrder} onChange={e => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} style={{ padding: 12, border: '1px solid #D4CFC5' }} />
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="submit" style={{ flex: 1, padding: 12, background: '#1A1A1A', color: '#fff', border: 'none', cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setEditing(null)} style={{ flex: 1, padding: 12, background: 'transparent', border: '1px solid #D4CFC5', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
