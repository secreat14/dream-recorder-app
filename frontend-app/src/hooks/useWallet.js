import { useState, useCallback } from 'react'
import { BrowserProvider } from 'ethers'
import * as walletApi from '../api/wallet'

export default function useWallet() {
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const hasMetaMask = typeof window !== 'undefined' && !!window.ethereum

  // 连接并绑定钱包
  const connectAndBind = useCallback(async () => {
    if (!window.ethereum) {
      setError('请安装 MetaMask 或在 MetaMask App 内置浏览器中打开')
      return null
    }

    setConnecting(true)
    setError('')

    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      // 获取 nonce
      const { data: nonceData } = await walletApi.getNonce(address)
      const { nonce, message } = nonceData

      // 签名
      const signature = await signer.signMessage(message)

      // 绑定
      const { data } = await walletApi.bindWallet({ address, signature, nonce })
      setConnecting(false)
      return data
    } catch (err) {
      setConnecting(false)
      const msg = err.response?.data?.detail || err.message || '连接失败'
      setError(msg)
      return null
    }
  }, [])

  return { hasMetaMask, connecting, error, connectAndBind, setError }
}
