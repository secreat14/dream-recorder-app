import client from './client'

// 获取签名 nonce
export function getNonce(address) {
  return client.get('/wallet/nonce', { params: { address } })
}

// 绑定钱包
export function bindWallet(data) {
  return client.post('/wallet/bind', data)
}

// 查询钱包信息
export function getWalletInfo() {
  return client.get('/wallet/info')
}

// 解绑钱包
export function unbindWallet() {
  return client.delete('/wallet/unbind')
}
