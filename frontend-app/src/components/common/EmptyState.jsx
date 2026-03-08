export default function EmptyState({ icon = '', text = '暂无数据', action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <div className="empty-text">{text}</div>
      {action}
    </div>
  )
}
