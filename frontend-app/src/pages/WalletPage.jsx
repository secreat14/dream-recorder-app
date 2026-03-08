import { useState, useEffect } from 'react'
import { getWalletInfo, unbindWallet } from '../api/wallet'
import { getWithdrawals } from '../api/token'
import WalletConnect from '../components/wallet/WalletConnect'
import WalletInfo from '../components/wallet/WalletInfo'
import WithdrawForm from '../components/token/WithdrawForm'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import Modal from '../components/common/Modal'
import { useToast } from '../components/common/Toast'
import { formatDate, formatDC } from '../utils/format'
import { WITHDRAW_COOLDOWN_HOURS } from '../utils/constants'

export default function WalletPage() {
  const toast = useToast()
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [withdrawals, setWithdrawals] = useState([])
  const [showUnbindModal, setShowUnbindModal] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      const { data } = await getWalletInfo()
      setWallet(data)
      if (data) {
        const { data: wd } = await getWithdrawals(1, 10)
        setWithdrawals(wd.withdrawals)
      }
    } catch {
      setWallet(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  async function handleUnbind() {
    try {
      await unbindWallet()
      toast.success('钱包已解绑')
      setWallet(null)
      setShowUnbindModal(false)
    } catch (err) {
      toast.error(err.response?.data?.detail || '解绑失败')
    }
  }

  // 计算是否过了冷却期
  const canWithdraw = wallet?.bound_at
    ? (Date.now() - new Date(wallet.bound_at).getTime()) > WITHDRAW_COOLDOWN_HOURS * 3600000
    : false

  if (loading) return <div className="page"><LoadingSpinner /></div>

  return (
    <div className="page fade-in">
      {!wallet ? (
        <>
          <div style={{ textAlign: 'center', padding: '32px 0 24px' }}>
            <div style={{ fontSize: 48 }}>🔗</div>
            <div style={{ fontSize: 16, fontWeight: 500, marginTop: 8 }}>绑定钱包</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              绑定 MetaMask 钱包以接收 DreamCoin 提现
            </div>
          </div>
          <WalletConnect onSuccess={loadData} />
        </>
      ) : (
        <>
          <WalletInfo wallet={wallet} onUnbind={() => setShowUnbindModal(true)} />

          <div className="divider" />

          {!canWithdraw ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: 'var(--warning)' }}>
                ⏳ 绑定钱包后需等待 {WITHDRAW_COOLDOWN_HOURS} 小时才能提现
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>提现</div>
              <WithdrawForm walletAddress={wallet.address} />
            </>
          )}

          {withdrawals.length > 0 && (
            <>
              <div className="divider" />
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>提现记录</div>
              {withdrawals.map(w => (
                <div key={w.id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-desc">
                      提现到 {w.wallet_address.slice(0, 6)}...
                      <span className={`status-badge ${w.status}`} style={{ marginLeft: 8 }}>
                        {w.status === 'pending' ? '待处理' :
                         w.status === 'completed' ? '已完成' :
                         w.status === 'processing' ? '处理中' : '失败'}
                      </span>
                    </div>
                    <div className="transaction-date">{formatDate(w.created_at)}</div>
                  </div>
                  <div className="transaction-amount withdraw">-{formatDC(w.amount)}</div>
                </div>
              ))}
            </>
          )}
        </>
      )}

      <Modal
        open={showUnbindModal}
        onClose={() => setShowUnbindModal(false)}
        title="确认解绑"
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => setShowUnbindModal(false)}>取消</button>
            <button className="btn btn-danger" onClick={handleUnbind}>确认解绑</button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
          解绑钱包后，重新绑定需要再次等待 {WITHDRAW_COOLDOWN_HOURS} 小时冷却期才能提现。
        </p>
      </Modal>
    </div>
  )
}
