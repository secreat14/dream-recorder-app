import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchDreamDetail } from '../api/client'

export default function DreamDetailPage() {
  const { id } = useParams()
  const [dream, setDream] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDreamDetail(id)
        setDream(data)
      } catch (err) {
        setError(err.response?.status === 404 ? '梦境不存在' : '加载失败')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="loading">加载中...</div>
  if (error) return <div className="error-state">{error}</div>
  if (!dream) return null

  return (
    <div className="dream-detail-page">
      <Link to="/dreams" className="back-link">← 返回列表</Link>

      <article className="dream-article">
        <header className="dream-detail-header">
          <h1>{dream.title}</h1>
          <div className="dream-detail-meta">
            {dream.nickname && <span className="dream-author">{dream.nickname}</span>}
            <span className="dream-date">{dream.created_at?.slice(0, 16).replace('T', ' ')}</span>
          </div>
        </header>

        <div className="dream-content">
          {dream.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <footer className="dream-detail-footer">
          <div className="dream-tags">
            {(dream.tags || []).map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
          {dream.ipfs_cid && (
            <div className="ipfs-info">
              <span className="ipfs-label">IPFS CID:</span>
              <a
                href={`https://ipfs.io/ipfs/${dream.ipfs_cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ipfs-link"
              >
                {dream.ipfs_cid.slice(0, 12)}...{dream.ipfs_cid.slice(-6)}
              </a>
            </div>
          )}
        </footer>
      </article>
    </div>
  )
}
