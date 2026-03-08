import client from './client'

// 发布梦境
export function postDream(data) {
  return client.post('/dreams', data)
}

// 获取我的梦境列表
export function getMyDreams(page = 1, size = 20) {
  return client.get('/dreams/mine', { params: { page, size } })
}

// 搜索梦境
export function searchDreams({ q = '', type = '', page = 1, size = 20 } = {}) {
  return client.get('/dreams/search', { params: { q, type, page, size } })
}

// 随机获取梦境
export function getRandomDream() {
  return client.get('/dreams/random')
}

// 查询发布者身份（消费5DC）
export function lookupIdentity(dreamId) {
  return client.post(`/dreams/${dreamId}/lookup`)
}

// 公开接口 —— 获取梦境列表
export function getPublicDreams(page = 1, size = 20) {
  return client.get('/public/dreams', { params: { page, size } })
}

// 公开接口 —— 获取梦境详情
export function getPublicDream(id) {
  return client.get(`/public/dreams/${id}`)
}

// 公开接口 —— 搜索
export function searchPublicDreams(q, page = 1, size = 20) {
  return client.get('/public/search', { params: { q, page, size } })
}
