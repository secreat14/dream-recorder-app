import { formatDate, shortenAddress, formatDC } from '../../utils/format'

export default function WalletInfo({ wallet, onUnbind }) {
  if (!wallet) return null

  return (
    <div className="wallet-info-card">
      <div className="info-row">
        <span className="info-label">钱包地址</span>
        <span className="wallet-address">{shortenAddress(wallet.address)}</span>
      </div>
      <div className="info-row">
        <span className="info-label">绑定时间</span>
        <span className="info-value">{formatDate(wallet.bound_at)}</span>
      </div>
      {wallet.onchain_balance != null && (
        <div className="info-row">
          <span className="info-label">链上余额</span>
          <span className="info-value">{formatDC(wallet.onchain_balance)} DC</span>
        </div>
      )}
      <div className="divider" />
      <button className="btn btn-danger btn-sm btn-block" onClick={onUnbind}>
        解绑钱包
      </button>
    </div>
  )
}
