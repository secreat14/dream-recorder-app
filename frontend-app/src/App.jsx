import { useEffect } from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import useAuthStore from './stores/authStore'
import AppShell from './components/layout/AppShell'
import LoadingSpinner from './components/common/LoadingSpinner'

// 页面
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DreamPostPage from './pages/DreamPostPage'
import MyDreamsPage from './pages/MyDreamsPage'
import ExplorePage from './pages/ExplorePage'
import DreamDetailPage from './pages/DreamDetailPage'
import TokenPage from './pages/TokenPage'
import WalletPage from './pages/WalletPage'
import ProfilePage from './pages/ProfilePage'

// 认证守卫
function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/register', { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return <Outlet />
}

export default function App() {
  const init = useAuthStore(s => s.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/register" element={<RegisterPage />} />

      {/* 认证保护路由 */}
      <Route element={<AuthGuard />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dream/new" element={<DreamPostPage />} />
          <Route path="/dreams" element={<MyDreamsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/:id" element={<DreamDetailPage />} />
          <Route path="/token" element={<TokenPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 未匹配路由 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
