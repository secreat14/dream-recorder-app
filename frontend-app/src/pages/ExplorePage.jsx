import { useState, useEffect, useRef } from 'react'
import { searchDreams } from '../api/dreams'
import DreamCard from '../components/dream/DreamCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import Pagination from '../components/common/Pagination'
import { PAGE_SIZE } from '../utils/constants'

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [dreams, setDreams] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef(null)

  // 300ms 防抖
  function handleInputChange(value) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(value)
      setPage(1)
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    searchDreams({ q: debouncedQuery, page, size: PAGE_SIZE })
      .then(({ data }) => {
        setDreams(data.dreams)
        setTotalPages(data.total_pages)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [debouncedQuery, page])

  function handleSearch(e) {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setDebouncedQuery(query)
    setPage(1)
  }

  return (
    <div className="page fade-in">
      <form onSubmit={handleSearch} className="search-bar" style={{ marginBottom: 12 }}>
        <span className="search-icon">🔍</span>
        <input
          value={query}
          onChange={e => handleInputChange(e.target.value)}
          placeholder="搜索梦境关键词或ID..."
        />
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : dreams.length === 0 ? (
        <EmptyState icon="🔍" text="没有找到匹配的梦境" />
      ) : (
        <>
          {dreams.map(d => <DreamCard key={d.id} dream={d} />)}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
