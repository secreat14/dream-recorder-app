import useWallet from '../../hooks/useWallet'

export default function WalletConnect({ onSuccess }) {
  const { hasMetaMask, connecting, error, connectAndBind } = useWallet()

  async function handleConnect() {
    const result = await connectAndBind()
    if (result) {
      onSuccess?.()
    }
  }

  if (!hasMetaMask) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🦊</div>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>需要 MetaMask</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          请安装 MetaMask 浏览器扩展，<br />
          或在 MetaMask App 内置浏览器中打开本页面
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        className="btn btn-primary btn-block"
        onClick={handleConnect}
        disabled={connecting}
      >
        {connecting ? '连接中...' : '🦊 连接 MetaMask'}
      </button>
      {error && <div className="form-error" style={{ marginTop: 8, textAlign: 'center' }}>{error}</div>}
    </div>
  )
}
