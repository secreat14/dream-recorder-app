import { create } from 'zustand'
import { storage } from '../utils/storage'
import * as authApi from '../api/auth'

const useAuthStore = create((set, get) => ({
  apiKey: storage.getApiKey(),
  profile: null,
  isAuthenticated: false,
  isLoading: true,

  // 初始化：验证已存储的 API Key
  init: async () => {
    const apiKey = storage.getApiKey()
    if (!apiKey) {
      set({ isLoading: false, isAuthenticated: false })
      return false
    }
    try {
      const { data } = await authApi.verify()
      if (data.valid) {
        const { data: profile } = await authApi.getProfile()
        set({ isAuthenticated: true, profile, isLoading: false })
        return true
      }
      storage.clearApiKey()
      set({ apiKey: '', isAuthenticated: false, isLoading: false })
      return false
    } catch {
      storage.clearApiKey()
      set({ apiKey: '', isAuthenticated: false, isLoading: false })
      return false
    }
  },

  // 注册
  register: async (machineCode, nickname, email, socialLinks) => {
    const { data } = await authApi.register({
      machine_code: machineCode,
      nickname,
      email,
      social_links: socialLinks
    })
    storage.setApiKey(data.api_key)
    set({ apiKey: data.api_key })
    // 注册后获取完整 profile
    const { data: profile } = await authApi.getProfile()
    set({ isAuthenticated: true, profile })
    return data
  },

  // 更新资料
  updateProfile: async (updates) => {
    const { data } = await authApi.updateProfile(updates)
    set({ profile: data })
    return data
  },

  // 使用已有密钥登录
  loginWithKey: async (apiKey) => {
    storage.setApiKey(apiKey)
    try {
      const { data } = await authApi.verify()
      if (!data.valid) {
        storage.clearApiKey()
        throw new Error('密钥无效或已过期')
      }
      const { data: profile } = await authApi.getProfile()
      set({ apiKey, isAuthenticated: true, profile })
    } catch (err) {
      storage.clearApiKey()
      set({ apiKey: '', isAuthenticated: false, profile: null })
      throw err
    }
  },

  // 登出
  logout: () => {
    storage.clearApiKey()
    set({ apiKey: '', profile: null, isAuthenticated: false })
  }
}))

export default useAuthStore
