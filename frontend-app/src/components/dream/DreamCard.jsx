import { useNavigate } from 'react-router-dom'
import { formatDate } from '../../utils/format'

export default function DreamCard({ dream }) {
  const navigate = useNavigate()

  return (
    <div className="dream-card" onClick={() => navigate(`/explore/${dream.id}`)}>
      <div className="dream-title">{dream.title}</div>
      <div className="dream-preview">{dream.preview}</div>
      <div className="dream-meta">
        <span>{dream.nickname || '匿名'}</span>
        <span>{formatDate(dream.created_at)}</span>
        <span>👁 {dream.view_count}</span>
      </div>
      {dream.tags?.length > 0 && (
        <div className="dream-tags">
          {dream.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}
