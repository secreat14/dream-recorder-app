import client from './client'

// 查询余额
export function getBalance() {
  return client.get('/token/balance')
}

// 查询流水
export function getTransactions({ type = '', page = 1, size = 20 } = {}) {
  return client.get('/token/transactions', { params: { type, page, size } })
}

// 查询奖励明细
export function getRewards(page = 1, size = 20) {
  return client.get('/token/rewards', { params: { page, size } })
}

// 提现
export function withdraw(amount) {
  return client.post('/token/withdraw', { amount })
}

// 查询提现记录
export function getWithdrawals(page = 1, size = 20) {
  return client.get('/token/withdrawals', { params: { page, size } })
}
