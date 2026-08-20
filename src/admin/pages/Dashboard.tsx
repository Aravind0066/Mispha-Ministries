import { useState, useEffect } from 'react'
import { authFetch } from '../../api'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authFetch('/api/admin/summary')
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading dashboard...</div>

  const stats = [
    { label: 'Unread Prayer Requests', value: data?.unreadPrayer || 0, color: '#B5654A' },
    { label: 'Total Prayer Requests', value: data?.prayer || 0, color: '#171918' },
    { label: 'Donation Interests', value: data?.donation || 0, color: '#4D6B4F' },
    { label: 'Contact Messages', value: data?.contact || 0, color: '#171918' },
    { label: 'Counselling Requests', value: data?.counselling || 0, color: '#171918' },
    { label: 'Leadership Enquiries', value: data?.leadership || 0, color: '#171918' },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginBottom: 32 }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24, marginBottom: 48 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#fff', padding: 24, border: '1px solid #E5E2DA', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B6E6D', marginBottom: 12 }}>{s.label}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 700, color: '#1A1A1A' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <Link to="/admin/forms" style={{ padding: '12px 24px', background: '#1A1A1A', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          View Inbox
        </Link>
        <Link to="/admin/content" style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #1A1A1A', color: '#1A1A1A', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          Edit Site Content
        </Link>
      </div>
    </div>
  )
}
