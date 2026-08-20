import { useState, useEffect } from 'react'
import { authFetch } from '../../api'

export default function Sermons() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)

  const load = () => authFetch<any[]>('/api/admin/sermons').then(setItems).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing.id) {
      await authFetch(`/api/admin/sermons/${editing.id}`, { method: 'PUT', body: JSON.stringify(editing) })
    } else {
      await authFetch('/api/admin/sermons', { method: 'POST', body: JSON.stringify(editing) })
    }
    setEditing(null)
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this sermon?')) return
    await authFetch(`/api/admin/sermons/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, margin: 0 }}>Sermons & Messages</h1>
        <button onClick={() => setEditing({ title: '', speaker: 'Rev. D. John Benni', date: new Date().toISOString().split('T')[0], embedUrl: '', notesUrl: '', category: 'Sermons' })}
          style={{ padding: '10px 20px', background: '#B5654A', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          + Add Sermon
        </button>
      </div>

      {loading ? <div>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map(item => (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #E5E2DA', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: '#B5654A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  {new Date(item.date).toLocaleDateString()} • {item.category}
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, margin: '0 0 4px 0' }}>{item.title}</h3>
                <div style={{ fontSize: 14, color: '#6B6E6D' }}>{item.speaker}</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setEditing({ ...item, date: item.date.split('T')[0] })} style={{ padding: '8px 16px', background: '#F4F0E8', border: 'none', cursor: 'pointer', fontSize: 12 }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ padding: '8px 16px', background: '#FDF0ED', color: '#C0392B', border: 'none', cursor: 'pointer', fontSize: 12 }}>Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div style={{ color: '#9B9E9D' }}>No sermons added yet.</div>}
        </div>
      )}

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: 32, width: '100%', maxWidth: 500, borderRadius: 12 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", marginTop: 0 }}>{editing.id ? 'Edit Sermon' : 'New Sermon'}</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input placeholder="Sermon Title" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} required style={{ padding: 12, border: '1px solid #D4CFC5' }} />
              <input placeholder="Speaker" value={editing.speaker} onChange={e => setEditing({ ...editing, speaker: e.target.value })} required style={{ padding: 12, border: '1px solid #D4CFC5' }} />
              <input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} required style={{ padding: 12, border: '1px solid #D4CFC5' }} />
              <input placeholder="YouTube Embed URL (e.g. https://www.youtube.com/embed/xyz)" value={editing.embedUrl} onChange={e => setEditing({ ...editing, embedUrl: e.target.value })} required style={{ padding: 12, border: '1px solid #D4CFC5' }} />
              <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} style={{ padding: 12, border: '1px solid #D4CFC5' }}>
                <option>Sermons</option>
                <option>Bible Teaching</option>
                <option>Pastor Training</option>
                <option>Mission</option>
                <option>Prayer</option>
                <option>Family</option>
              </select>
              
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
