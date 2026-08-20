import { useState, useEffect } from 'react'
import { authFetch } from '../../api'

export default function FormsInbox() {
  const [activeTab, setActiveTab] = useState<'prayer' | 'counselling' | 'contact' | 'donation' | 'leadership'>('prayer')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    authFetch<any[]>(`/api/admin/forms/${activeTab}`)
      .then(setItems)
      .finally(() => setLoading(false))
  }, [activeTab])

  const toggleStatus = async (id: number, current: any, field: string) => {
    await authFetch(`/api/admin/forms/${activeTab}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ [field]: !current }),
    })
    setItems(items.map(it => it.id === id ? { ...it, [field]: !current } : it))
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this submission?')) return
    await authFetch(`/api/admin/forms/${activeTab}/${id}`, { method: 'DELETE' })
    setItems(items.filter(it => it.id !== id))
  }

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginBottom: 24 }}>Forms Inbox</h1>
      
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, borderBottom: '1px solid #E5E2DA', paddingBottom: 16 }}>
        {['prayer', 'counselling', 'contact', 'donation', 'leadership'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)}
            style={{
              padding: '8px 16px', background: activeTab === tab ? '#1A1A1A' : 'transparent',
              color: activeTab === tab ? '#fff' : '#6B6E6D', border: 'none', borderRadius: 20,
              cursor: 'pointer', textTransform: 'capitalize', fontSize: 14, fontWeight: 600,
            }}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? <div>Loading...</div> : (
        <div style={{ background: '#fff', border: '1px solid #E5E2DA' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#FAFAF8', borderBottom: '1px solid #E5E2DA', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.05em', color: '#6B6E6D' }}>
                <th style={{ padding: '16px 24px' }}>Date</th>
                <th style={{ padding: '16px 24px' }}>Name</th>
                <th style={{ padding: '16px 24px' }}>Details</th>
                <th style={{ padding: '16px 24px' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #E5E2DA' }}>
                  <td style={{ padding: '16px 24px' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px', fontWeight: 500 }}>{item.name || 'Anonymous'}</td>
                  <td style={{ padding: '16px 24px', maxWidth: 400 }}>
                    {activeTab === 'prayer' && <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>[{item.category}] {item.request}</div>}
                    {activeTab === 'counselling' && <div>{item.phone} • {item.type}</div>}
                    {activeTab === 'contact' && <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.message}</div>}
                    {activeTab === 'donation' && <div>{item.area} • {item.tier}</div>}
                    {activeTab === 'leadership' && <div>{item.track}</div>}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {activeTab === 'prayer' && (
                      <button onClick={() => toggleStatus(item.id, item.prayed, 'prayed')}
                        style={{ padding: '4px 8px', fontSize: 11, background: item.prayed ? '#EEF4EE' : '#FDF0ED', color: item.prayed ? '#4D6B4F' : '#C0392B', border: 'none', cursor: 'pointer', borderRadius: 4 }}>
                        {item.prayed ? 'Prayed' : 'Unprayed'}
                      </button>
                    )}
                    {activeTab === 'counselling' && (
                      <button onClick={() => toggleStatus(item.id, item.contacted, 'contacted')}
                        style={{ padding: '4px 8px', fontSize: 11, background: item.contacted ? '#EEF4EE' : '#FDF0ED', color: item.contacted ? '#4D6B4F' : '#C0392B', border: 'none', cursor: 'pointer', borderRadius: 4 }}>
                        {item.contacted ? 'Contacted' : 'Pending'}
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#C0392B', cursor: 'pointer', fontSize: 12 }}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#9B9E9D' }}>No submissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
