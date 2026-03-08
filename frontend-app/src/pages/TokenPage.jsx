import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BalanceCard from '../components/token/BalanceCard'
import TransactionList from '../components/token/TransactionList'
import useTokenStore from '../stores/tokenStore'

export default function TokenPage() {
  const navigate = useNavigate()
  const refresh = useTokenStore(s => s.refresh)

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <div className="page fade-in">
      <BalanceCard />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/wallet')}>
          💰 提现
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/dream/new')}>
          ✨ 赚取
        </button>
      </div>

      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>交易流水</div>
      <TransactionList />
    </div>
  )
}
