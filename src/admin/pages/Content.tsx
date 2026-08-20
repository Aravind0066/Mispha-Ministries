import { useState, useEffect } from 'react'
import { authFetch } from '../../api'

export default function Content() {
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
    alert('Content saved!')
  }

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginBottom: 32 }}>Site Content Editor</h1>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 800 }}>
        
        {/* Hero Section */}
        <div style={{ background: '#fff', padding: 32, border: '1px solid #E5E2DA' }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginTop: 0, marginBottom: 24 }}>Hero Section</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Hero Headline (Line 1)</label>
              <input value={settings.hero_line1 || 'Building churches.'} onChange={e => handleChange('hero_line1', e.target.value)} style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Hero Headline (Line 2)</label>
              <input value={settings.hero_line2 || 'Equipping leaders.'} onChange={e => handleChange('hero_line2', e.target.value)} style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Hero Subtitle</label>
              <input value={settings.hero_subtitle || 'Sending the Gospel forward.'} onChange={e => handleChange('hero_subtitle', e.target.value)} style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Hero Description</label>
              <textarea value={settings.hero_desc || 'Mispha Ministries plants churches, prepares pastors, sends missionaries and develops Christian leaders who strengthen families and communities.'} onChange={e => handleChange('hero_desc', e.target.value)} rows={3} style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5', resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Can add more sections here like Annual Covenant targets, Prayer statements, etc. */}
        <div style={{ background: '#fff', padding: 32, border: '1px solid #E5E2DA' }}>
           <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginTop: 0, marginBottom: 24 }}>Prayer Statements (Rotating)</h2>
           <p style={{ fontSize: 14, color: '#6B6E6D', marginBottom: 16 }}>Enter one statement per line.</p>
           <textarea 
             value={settings.prayer_statements || "Prayer is the key for vision\nVision is the key for heaven\nHeaven is the key for prayer"} 
             onChange={e => handleChange('prayer_statements', e.target.value)} 
             rows={5} 
             style={{ width: '100%', padding: 12, border: '1px solid #D4CFC5', resize: 'vertical' }} 
           />
        </div>

        <button type="submit" disabled={saving} style={{ alignSelf: 'flex-start', padding: '14px 32px', background: '#B5654A', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>
          {saving ? 'Saving...' : 'Save All Content'}
        </button>

      </form>
    </div>
  )
}
