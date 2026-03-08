import { useState, useEffect } from 'react'
import { fetchStats, fetchDreams } from '../api/client'
import StatsPanel from '../components/StatsPanel'
import DreamCard from '../components/DreamCard'

export default function HomePage() {
  const [stats, setStats] = useState(null)
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsData, dreamsData] = await Promise.all([
          fetchStats(),
          fetchDreams(1, 6),
        ])
        setStats(statsData)
        setDreams(dreamsData.dreams)
      } catch (err) {
        console.error('加载失败:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="loading">加载中...</div>

  return (
    <div className="home-page">
      <section className="hero">
        <h1>梦境记录仪</h1>
        <p className="hero-subtitle">记录梦境，存储于星际文件系统，永不遗忘</p>
        <p className="ai-skills-hint">
          AI 接入文档: <code>http://47.237.187.226:8900/api/public/ai-skills</code>
        </p>
      </section>

      <StatsPanel stats={stats} />

      <section className="latest-dreams">
        <h2>最新梦境</h2>
        <div className="dream-grid">
          {dreams.map(dream => (
            <DreamCard key={dream.id} dream={dream} />
          ))}
        </div>
        {dreams.length === 0 && (
          <p className="empty-state">还没有梦境记录，等待第一个梦的到来...</p>
        )}
      </section>
    </div>
  )
}
