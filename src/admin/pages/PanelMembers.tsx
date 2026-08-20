import { useState, useEffect } from 'react'
import { authFetch } from '../../api'
import ImageUpload from '../components/ImageUpload'

export default function PanelMembers() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)

  const load = () => authFetch<any[]>('/api/admin/board-members').then(setItems).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing.id) {
      await authFetch(`/api/admin/board-members/${editing.id}`, { method: 'PUT', body: JSON.stringify(editing) })
    } else {
      await authFetch('/api/admin/board-members', { method: 'POST', body: JSON.stringify(editing) })
    }
    setEditing(null)
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this member?')) return
    await authFetch(`/api/admin/board-members/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, margin: 0 }}>Board Members</h1>
        <button onClick={() => setEditing({ name: '', role: '', bio: '', imageUrl: '', side: 'left', sortOrder: 0 })}
          style={{ padding: '10px 20px', background: '#B5654A', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          + Add Member
        </button>
      </div>

      {loading ? <div>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #E5E2DA', display: 'flex', gap: 24, padding: 24 }}>
              <img src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.name} style={{ width: 120, height: 160, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#6B6E6D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{item.role}</div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, margin: '0 0 12px 0' }}>{item.name}</h3>
                <p style={{ fontSize: 14, color: '#6B6E6D', margin: '0 0 16px 0', maxWidth: 600 }}>{item.bio}</p>
                <div style={{ fontSize: 12, color: '#9B9E9D', marginBottom: 16 }}>Layout: Image on {item.side}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setEditing(item)} style={{ padding: '6px 16px', background: '#F4F0E8', border: 'none', cursor: 'pointer', fontSize: 12 }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 16px', background: '#FDF0ED', color: '#C0392B', border: 'none', cursor: 'pointer', fontSize: 12 }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: 32, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", marginTop: 0 }}>{editing.id ? 'Edit Member' : 'New Member'}</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <ImageUpload currentUrl={editing.imageUrl} onUploaded={url => setEditing({ ...editing, imageUrl: url })} />
              <input placeholder="Name" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} required style={{ padding: 12, border: '1px solid #D4CFC5' }} />
              <input placeholder="Role" value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} required style={{ padding: 12, border: '1px solid #D4CFC5' }} />
              <textarea placeholder="Biography" value={editing.bio} onChange={e => setEditing({ ...editing, bio: e.target.value })} rows={4} style={{ padding: 12, border: '1px solid #D4CFC5', resize: 'vertical' }} />
              
              <div>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Layout Side (matches current design)</label>
                <select value={editing.side} onChange={e => setEditing({ ...editing, side: e.target.value })} style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5' }}>
                  <option value="left">Image on Left</option>
                  <option value="right">Image on Right</option>
                </select>
              </div>

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
