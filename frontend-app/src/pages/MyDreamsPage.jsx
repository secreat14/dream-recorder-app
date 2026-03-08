import { useState, useEffect } from 'react'
import { getMyDreams } from '../api/dreams'
import DreamCard from '../components/dream/DreamCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import Pagination from '../components/common/Pagination'
import { useNavigate } from 'react-router-dom'
import { PAGE_SIZE } from '../utils/constants'

export default function MyDreamsPage() {
  const navigate = useNavigate()
  const [dreams, setDreams] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getMyDreams(page, PAGE_SIZE)
      .then(({ data }) => {
        setDreams(data.dreams)
        setTotalPages(data.total_pages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  if (loading) return <div className="page"><LoadingSpinner /></div>

  return (
    <div className="page fade-in">
      {dreams.length === 0 ? (
        <EmptyState
          icon="🌙"
          text="还没有记录过梦境"
          action={
            <button className="btn btn-primary" onClick={() => navigate('/dream/new')}>
              记录第一个梦境
            </button>
          }
        />
      ) : (
        <>
          {dreams.map(d => <DreamCard key={d.id} dream={d} />)}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
