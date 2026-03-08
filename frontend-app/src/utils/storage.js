const PREFIX = 'dreamchain_'

export const storage = {
  get(key) {
    try {
      const val = localStorage.getItem(PREFIX + key)
      return val ? JSON.parse(val) : null
    } catch {
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      // 存储已满时静默失败
    }
  },

  remove(key) {
    localStorage.removeItem(PREFIX + key)
  },

  getApiKey() {
    return localStorage.getItem(PREFIX + 'api_key') || ''
  },

  setApiKey(key) {
    localStorage.setItem(PREFIX + 'api_key', key)
  },

  clearApiKey() {
    localStorage.removeItem(PREFIX + 'api_key')
  },

  // 将 API Key 下载为本地文件
  downloadApiKey(apiKey) {
    const content = [
      '梦境记录仪 API 密钥',
      '========================',
      '',
      apiKey,
      '',
      '请妥善保管此密钥。',
      '如果清除浏览器数据或更换设备，需要使用此密钥重新登录。',
      '切勿将此密钥分享给他人。'
    ].join('\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dreamchain-api-key.txt'
    a.click()
    URL.revokeObjectURL(url)
  }
}
