import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/dreams', label: '浏览梦境' },
    { path: '/search', label: '搜索' },
  ]

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🌙</span>
          <span className="logo-text">梦境记录仪</span>
        </Link>
        <nav className="nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
