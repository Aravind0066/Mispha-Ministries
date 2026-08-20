import { useState, useEffect } from 'react'
import { authFetch } from '../../api'

export default function Settings() {
  const [settings, setSettings] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    authFetch<any>('/api/admin/settings').then(setSettings)
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await authFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    })
    setSaving(false)
    alert('Settings saved!')
  }

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginBottom: 32 }}>Site Settings</h1>
      
      <form onSubmit={handleSave} style={{ background: '#fff', border: '1px solid #E5E2DA', padding: 32, maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        <div>
          <h3 style={{ fontSize: 16, marginBottom: 16, borderBottom: '1px solid #E5E2DA', paddingBottom: 8 }}>Contact Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Phone Number</label>
              <input value={settings.contact_phone || ''} onChange={e => handleChange('contact_phone', e.target.value)} style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Email Address</label>
              <input value={settings.contact_email || ''} onChange={e => handleChange('contact_email', e.target.value)} style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Ministry Address</label>
              <textarea value={settings.contact_address || ''} onChange={e => handleChange('contact_address', e.target.value)} rows={3} style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5' }} />
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 16, marginBottom: 16, borderBottom: '1px solid #E5E2DA', paddingBottom: 8 }}>Impact Statistics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Churches Planted</label>
              <input value={settings.stat_churches || ''} onChange={e => handleChange('stat_churches', e.target.value)} style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Pastors Trained</label>
              <input value={settings.stat_pastors || ''} onChange={e => handleChange('stat_pastors', e.target.value)} style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Active Mission Fields</label>
              <input value={settings.stat_missions || ''} onChange={e => handleChange('stat_missions', e.target.value)} style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5' }} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} style={{ padding: '14px 24px', background: '#1A1A1A', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: 16 }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

      </form>
    </div>
  )
}
