import { formatDate } from '../../utils/format'

export default function DreamContent({ dream }) {
  if (!dream) return null

  return (
    <div className="dream-detail">
      <h1 className="dream-detail-title">{dream.title}</h1>
      <div className="dream-detail-meta">
        <span>{dream.nickname || '匿名'}</span>
        <span>{formatDate(dream.created_at)}</span>
        <span>👁 {dream.view_count}</span>
      </div>
      <div className="dream-detail-content">{dream.content}</div>
      <div className="dream-detail-footer">
        {dream.tags?.length > 0 && (
          <div className="dream-tags" style={{ marginBottom: 12 }}>
            {dream.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
        {dream.ipfs_cid && (
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
            IPFS CID: {dream.ipfs_cid}
          </div>
        )}
      </div>
    </div>
  )
}
