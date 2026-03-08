import { useState } from 'react'
import { withdraw } from '../../api/token'
import { useToast } from '../common/Toast'
import useTokenStore from '../../stores/tokenStore'
import { MIN_WITHDRAW_AMOUNT } from '../../utils/constants'
import { formatDC } from '../../utils/format'

export default function WithdrawForm({ walletAddress }) {
  const toast = useToast()
  const { balance, refresh } = useTokenStore()
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const numAmount = Number(amount)
  const canSubmit = numAmount >= MIN_WITHDRAW_AMOUNT && numAmount <= balance && !submitting

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await withdraw(numAmount)
      toast.success('提现请求已提交')
      setAmount('')
      refresh()
    } catch (err) {
      toast.error(err.response?.data?.detail || '提现失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="withdraw-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">提现金额</label>
        <div className="amount-input-wrap">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder={`最低 ${MIN_WITHDRAW_AMOUNT}`}
            min={MIN_WITHDRAW_AMOUNT}
            max={balance}
            step="0.01"
          />
          <span className="amount-unit">DC</span>
        </div>
        <div className="form-hint">
          可用余额：{formatDC(balance)} DC | 最低提现：{MIN_WITHDRAW_AMOUNT} DC
        </div>
      </div>
      <div className="form-hint" style={{ marginBottom: 12 }}>
        提现将发送到已绑定钱包：{walletAddress}
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={!canSubmit}>
        {submitting ? '提交中...' : '确认提现'}
      </button>
    </form>
  )
}
