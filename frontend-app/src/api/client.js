import axios from 'axios'
import { storage } from '../utils/storage'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// 请求拦截器：注入 X-Api-Key
client.interceptors.request.use(config => {
  const apiKey = storage.getApiKey()
  if (apiKey) {
    config.headers['X-Api-Key'] = apiKey
  }
  return config
})

// 响应拦截器：处理 401 和 429
client.interceptors.response.use(
  res => res,
  error => {
    const status = error.response?.status
    if (status === 401) {
      storage.clearApiKey()
      window.location.href = '/register'
    } else if (status === 429) {
      const detail = error.response?.data?.detail || '请求过于频繁，请稍后再试'
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(detail)
      }
    }
    return Promise.reject(error)
  }
)

export default client
