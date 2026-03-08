import { create } from 'zustand'
import * as tokenApi from '../api/token'

const CACHE_TTL = 60000 // 60秒缓存

const useTokenStore = create((set, get) => ({
  balance: 0,
  totalEarned: 0,
  totalSpent: 0,
  totalWithdrawn: 0,
  lastFetched: 0,

  // 获取余额（带缓存）
  fetchBalance: async () => {
    const now = Date.now()
    if (now - get().lastFetched < CACHE_TTL) return
    try {
      const { data } = await tokenApi.getBalance()
      set({
        balance: data.balance,
        totalEarned: data.total_earned,
        totalSpent: data.total_spent,
        totalWithdrawn: data.total_withdrawn,
        lastFetched: now
      })
    } catch {
      // 静默处理
    }
  },

  // 强制刷新（无视缓存）
  refresh: async () => {
    try {
      const { data } = await tokenApi.getBalance()
      set({
        balance: data.balance,
        totalEarned: data.total_earned,
        totalSpent: data.total_spent,
        totalWithdrawn: data.total_withdrawn,
        lastFetched: Date.now()
      })
    } catch {
      // 静默处理
    }
  }
}))

export default useTokenStore
