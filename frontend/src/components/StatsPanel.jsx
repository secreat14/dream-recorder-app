export default function StatsPanel({ stats }) {
  if (!stats) return null

  const items = [
    { label: '注册设备', value: stats.total_devices, icon: '📱' },
    { label: '梦境总数', value: stats.total_dreams, icon: '💭' },
  ]

  return (
    <div className="stats-panel">
      {items.map(item => (
        <div key={item.label} className="stat-card">
          <span className="stat-icon">{item.icon}</span>
          <span className="stat-value">{item.value}</span>
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
