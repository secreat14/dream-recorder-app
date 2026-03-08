import useTokenStore from '../../stores/tokenStore'
import { formatDC } from '../../utils/format'

export default function BalanceCard() {
  const { balance, totalEarned, totalSpent, totalWithdrawn } = useTokenStore()

  return (
    <div className="balance-card">
      <div className="balance-label">当前余额</div>
      <div className="balance-amount">
        {formatDC(balance)}
        <span className="balance-unit">DC</span>
      </div>
      <div className="balance-stats">
        <div className="balance-stat">
          <div className="stat-value">{formatDC(totalEarned)}</div>
          <div className="stat-label">累计获得</div>
        </div>
        <div className="balance-stat">
          <div className="stat-value">{formatDC(totalSpent)}</div>
          <div className="stat-label">累计消费</div>
        </div>
        <div className="balance-stat">
          <div className="stat-value">{formatDC(totalWithdrawn)}</div>
          <div className="stat-label">已提现</div>
        </div>
      </div>
    </div>
  )
}
