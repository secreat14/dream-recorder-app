import { useLocation, useNavigate } from 'react-router-dom'
import useTokenStore from '../../stores/tokenStore'
import { formatDC } from '../../utils/format'

const TITLES = {
  '/': '首页',
  '/dream/new': '记录梦境',
  '/dreams': '我的梦境',
  '/explore': '探索',
  '/token': '代币',
  '/wallet': '钱包',
  '/profile': '个人资料'
}

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const balance = useTokenStore(s => s.balance)

  // 根据路径匹配标题
  let title = TITLES[location.pathname] || '梦境记录仪'
  if (location.pathname.startsWith('/explore/')) title = '梦境详情'

  const showBack = location.pathname !== '/'

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--topbar-height)',
      paddingTop: 'var(--safe-top)',
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 40 }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: 'none', color: 'var(--accent)',
              fontSize: 20, cursor: 'pointer', padding: 4, minWidth: 44, minHeight: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ←
          </button>
        )}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        {title}
      </div>
      <div
        style={{
          fontSize: 13, color: 'var(--accent)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, minWidth: 40, justifyContent: 'flex-end'
        }}
        onClick={() => navigate('/token')}
      >
        💎 {formatDC(balance)}
      </div>
    </header>
  )
}
