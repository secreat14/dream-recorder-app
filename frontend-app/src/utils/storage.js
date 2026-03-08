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
  }
}
