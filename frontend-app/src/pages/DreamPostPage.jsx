import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DreamForm from '../components/dream/DreamForm'
import { getMyDreams } from '../api/dreams'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function DreamPostPage() {
  const navigate = useNavigate()
  const [hasDreamToday, setHasDreamToday] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
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
    }).catch(() => {}).finally(() => setChecking(false))
  }, [])

  if (checking) return <div className="page"><LoadingSpinner /></div>

  if (hasDreamToday) {
    return (
      <div className="page">
        <div className="dream-posted-notice fade-in">
          <div className="notice-icon">🌟</div>
          <div className="notice-text">今天已经记录过梦境了</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            每天可以记录一个梦境，明天再来吧！
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/dreams')}>
            查看我的梦境
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page fade-in">
      <DreamForm onSuccess={() => navigate('/dreams')} />
    </div>
  )
}
