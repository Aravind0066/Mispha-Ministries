import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './Login'
import Dashboard from './pages/Dashboard'
import FormsInbox from './pages/FormsInbox'
import Gallery from './pages/Gallery'
import PanelMembers from './pages/PanelMembers'
import Sermons from './pages/Sermons'
import Content from './pages/Content'
import Settings from './pages/Settings'
import AdminNav from './components/AdminNav'

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('mispha_admin_token'))
  const navigate = useNavigate()

  useEffect(() => {
    if (token) localStorage.setItem('mispha_admin_token', token)
    else localStorage.removeItem('mispha_admin_token')
  }, [token])

  if (!token) {
    return <Login onLogin={setToken} />
  }

  return (
    <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', background: '#F9F9F8', color: '#1A1A1A' }}>
      <AdminNav onLogout={() => { setToken(null); navigate('/admin') }} />
      <div className="admin-content" style={{ flex: 1, marginLeft: 240, padding: '40px 60px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/forms" element={<FormsInbox />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/board" element={<PanelMembers />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/content" element={<Content />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  )
}
