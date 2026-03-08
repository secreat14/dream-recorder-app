import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import useTokenStore from '../../stores/tokenStore'

export default function AppShell() {
  const fetchBalance = useTokenStore(s => s.fetchBalance)

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return (
    <div style={{ height: '100%' }}>
      <TopBar />
      <main style={{
        paddingTop: `calc(var(--topbar-height) + var(--safe-top))`,
        paddingBottom: `calc(var(--bottomnav-height) + var(--safe-bottom) + 16px)`,
        minHeight: '100vh'
      }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
