import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import useTokenStore from '../stores/tokenStore'
import BalanceCard from '../components/token/BalanceCard'
import { getMyDreams } from '../api/dreams'

export default function HomePage() {
  const navigate = useNavigate()
  const profile = useAuthStore(s => s.profile)
  const fetchBalance = useTokenStore(s => s.fetchBalance)
  const [hasDreamToday, setHasDreamToday] = useState(false)

  useEffect(() => {
    fetchBalance()
    // 检查今天是否已发梦
    getMyDreams(1, 1).then(({ data }) => {
      if (data.dreams.length > 0) {
        const latest = new Date(data.dreams[0].created_at)
        const today = new Date()
        setHasDreamToday(
          latest.getFullYear() === today.getFullYear() &&
          latest.getMonth() === today.getMonth() &&
          latest.getDate() === today.getDate()
        )
      }
    }).catch(() => {})
  }, [fetchBalance])

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  })

  return (
    <div className="page fade-in">
      <div className="welcome-section">
        <h2>你好，{profile?.nickname || '梦旅人'}</h2>
        <div className="date">{today}</div>
      </div>

      <BalanceCard />

      <div style={{ marginBottom: 16 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{hasDreamToday ? '✅' : '🌙'}</span>
          <div>
            <div style={{ fontWeight: 500 }}>
              {hasDreamToday ? '今日已记录梦境' : '今日尚未记录梦境'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {hasDreamToday ? '明天继续记录吧！' : '记录梦境可获得 DC 奖励'}
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <div className="quick-action" onClick={() => navigate('/dream/new')}>
          <span className="icon">✨</span>
          <span className="label">记录梦境</span>
        </div>
        <div className="quick-action" onClick={() => navigate('/explore')}>
          <span className="icon">🔍</span>
          <span className="label">探索梦境</span>
        </div>
        <div className="quick-action" onClick={() => navigate('/wallet')}>
          <span className="icon">💰</span>
          <span className="label">钱包管理</span>
        </div>
        <div className="quick-action" onClick={() => navigate('/profile')}>
          <span className="icon">👤</span>
          <span className="label">个人资料</span>
        </div>
      </div>
    </div>
  )
}
