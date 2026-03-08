/**
 * 格式化日期为中文友好格式
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const now = new Date()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return y === now.getFullYear() ? `${m}-${day}` : `${y}-${m}-${day}`
}

/**
 * 格式化代币数量
 */
export function formatDC(amount) {
  if (amount == null) return '0'
  const n = Number(amount)
  if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n % 1 === 0 ? n.toString() : n.toFixed(2)
}

/**
 * 截断以太坊地址
 */
export function shortenAddress(addr) {
  if (!addr || addr.length < 10) return addr || ''
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

/**
 * 脱敏 API Key
 */
export function maskApiKey(key) {
  if (!key || key.length < 12) return key || ''
  return key.slice(0, 8) + '****' + key.slice(-4)
}
