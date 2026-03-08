import client from './client'

// 注册设备
export function register(data) {
  return client.post('/auth/register', data)
}

// 验证 API Key
export function verify() {
  return client.get('/auth/verify')
}

// 获取个人资料
export function getProfile() {
  return client.get('/auth/profile')
}

// 更新个人资料
export function updateProfile(data) {
  return client.put('/auth/profile', data)
}
