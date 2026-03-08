import { Link } from 'react-router-dom'

export default function DreamCard({ dream }) {
  return (
    <Link to={`/dreams/${dream.id}`} className="dream-card">
      <div className="dream-card-header">
        <h3 className="dream-card-title">{dream.title}</h3>
      </div>
      <p className="dream-card-preview">{dream.preview}</p>
      <div className="dream-card-footer">
        <div className="dream-tags">
          {(dream.tags || []).slice(0, 3).map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
        <span className="dream-meta">
          {dream.nickname && <span className="dream-author">{dream.nickname}</span>}
          <span className="dream-date">{dream.created_at?.slice(0, 10)}</span>
        </span>
      </div>
    </Link>
  )
}
