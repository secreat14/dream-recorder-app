import { useState, useEffect } from 'react'
import { getTransactions } from '../../api/token'
import { formatDate, formatDC } from '../../utils/format'
import { TRANSACTION_TYPES, PAGE_SIZE } from '../../utils/constants'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'
import Pagination from '../common/Pagination'

export default function TransactionList() {
  const [type, setType] = useState('')
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getTransactions({ type, page, size: PAGE_SIZE })
      .then(({ data }) => {
        setItems(data.transactions)
        setTotalPages(data.total_pages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [type, page])

  function handleTypeChange(newType) {
    setType(newType)
    setPage(1)
  }

  return (
    <div>
      <div className="tabs">
        {TRANSACTION_TYPES.map(t => (
          <div
            key={t.value}
            className={`tab ${type === t.value ? 'active' : ''}`}
            onClick={() => handleTypeChange(t.value)}
          >
            {t.label}
          </div>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon="📭" text="暂无流水记录" />
      ) : (
        <>
          {items.map(tx => (
            <div key={tx.id} className="transaction-item">
              <div className="transaction-info">
                <div className="transaction-desc">{tx.description || tx.reference_type}</div>
                <div className="transaction-date">{formatDate(tx.created_at)}</div>
              </div>
              <div className={`transaction-amount ${tx.type}`}>
                {tx.type === 'earn' ? '+' : '-'}{formatDC(tx.amount)}
              </div>
            </div>
          ))}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
