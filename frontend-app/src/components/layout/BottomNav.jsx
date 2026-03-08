import { useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  { path: '/', icon: '🏠', label: '首页' },
  { path: '/explore', icon: '🔍', label: '探索' },
  { path: '/dream/new', icon: '✨', label: '发梦', center: true },
  { path: '/token', icon: '💎', label: '代币' },
  { path: '/dreams', icon: '📋', label: '我的' }
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: `calc(var(--bottomnav-height) + var(--safe-bottom))`,
      paddingBottom: 'var(--safe-bottom)',
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 100
    }}>
      {TABS.map(tab => {
        const active = tab.path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(tab.path)

        if (tab.center) {
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                width: 48, height: 48,
                borderRadius: '50%',
                background: 'var(--accent)',
                border: 'none',
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transform: 'translateY(-8px)',
                boxShadow: '0 4px 12px var(--accent-glow)'
              }}
            >
              {tab.icon}
            </button>
          )
        }

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: 20,
              padding: '4px 12px',
              minWidth: 44,
              minHeight: 44
            }}
          >
            <span>{tab.icon}</span>
            <span style={{ fontSize: 10 }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
