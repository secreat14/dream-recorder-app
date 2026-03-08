// 业务常量（与后端 config.py 对齐）
export const MIN_WITHDRAW_AMOUNT = 10
export const WITHDRAW_COOLDOWN_HOURS = 72
export const IDENTITY_LOOKUP_COST = 5
export const MIN_CONTENT_LENGTH = 50
export const REWARD_DREAM_POST = 5

// 流水类型
export const TRANSACTION_TYPES = [
  { value: '', label: '全部' },
  { value: 'earn', label: '获得' },
  { value: 'spend', label: '消费' },
  { value: 'withdraw', label: '提现' }
]

// 社交平台选项
export const SOCIAL_PLATFORMS = [
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'discord', label: 'Discord' },
  { value: 'wechat', label: '微信' },
  { value: 'email', label: '邮箱' },
  { value: 'other', label: '其他' }
]

// 分页
export const PAGE_SIZE = 20
