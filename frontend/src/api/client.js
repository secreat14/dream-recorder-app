import axios from 'axios'

const api = axios.create({
  baseURL: 'http://47.237.187.226:8900/api',
  timeout: 15000,
})

// 公开接口
export async function fetchStats() {
  const { data } = await api.get('/public/stats')
  return data
}

export async function fetchDreams(page = 1, size = 20, type = '') {
  const params = { page, size }
  if (type) params.type = type
  const { data } = await api.get('/public/dreams', { params })
  return data
}

export async function fetchDreamDetail(id) {
  const { data } = await api.get(`/public/dreams/${id}`)
  return data
}

export async function searchDreams(q, type = '', page = 1, size = 20) {
  const params = { q, page, size }
  if (type) params.type = type
  const { data } = await api.get('/public/search', { params })
  return data
}

export default api
