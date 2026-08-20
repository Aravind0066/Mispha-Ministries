import { NavLink } from 'react-router-dom'

export default function AdminNav({ onLogout }: { onLogout: () => void }) {
  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/forms', label: 'Forms Inbox' },
    { to: '/admin/gallery', label: 'Gallery' },
    { to: '/admin/board', label: 'Board Members' },
    { to: '/admin/sermons', label: 'Sermons' },
    { to: '/admin/content', label: 'Site Content' },
    { to: '/admin/settings', label: 'Settings' },
  ]

  return (
    <nav style={{ width: 240, background: '#171918', color: '#F4F0E8', position: 'fixed', top: 0, bottom: 0, left: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, letterSpacing: '0.05em', color: '#F4F0E8', margin: 0 }}>Mispha Admin</h2>
        <a href="/" target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#B5654A', textDecoration: 'none', marginTop: 6, display: 'inline-block' }}>View Live Site ↗</a>
      </div>
      
      <div style={{ flex: 1, padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(link => (
          <NavLink key={link.to} to={link.to} end={link.to === '/admin'}
            style={({ isActive }) => ({
              padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12,
              textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              color: isActive ? '#fff' : 'rgba(244,240,232,0.5)',
              background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
              borderLeft: `3px solid ${isActive ? '#B5654A' : 'transparent'}`,
            })}>
            <span></span> {link.label}
          </NavLink>
        ))}
      </div>

      <div style={{ padding: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={onLogout} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#F4F0E8', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
          Sign Out
        </button>
      </div>
    </nav>
  )
}
