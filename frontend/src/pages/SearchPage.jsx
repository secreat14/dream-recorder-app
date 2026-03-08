import { useState } from 'react'
import { searchDreams } from '../api/client'
import SearchBar from '../components/SearchBar'
import DreamCard from '../components/DreamCard'
import Pagination from '../components/Pagination'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  async function doSearch(q, p = 1) {
    if (!q) return
    setLoading(true)
    setQuery(q)
    setPage(p)
    try {
      const result = await searchDreams(q, '', p, 12)
      setData(result)
    } catch (err) {
      console.error('搜索失败:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-page">
      <h1>搜索梦境</h1>
      <SearchBar onSearch={(q) => doSearch(q, 1)} initialQuery={query} />

      {loading && <div className="loading">搜索中...</div>}

      {data && !loading && (
        <>
          <p className="search-result-count">
            找到 {data.total} 条相关梦境
          </p>
          <div className="dream-grid">
            {data.dreams.map(dream => (
              <DreamCard key={dream.id} dream={dream} />
            ))}
          </div>
          {data.dreams.length === 0 && (
            <p className="empty-state">没有找到匹配的梦境</p>
          )}
          <Pagination
            page={data.page}
            totalPages={data.total_pages}
            onPageChange={(p) => doSearch(query, p)}
          />
        </>
      )}

      {!data && !loading && (
        <p className="empty-state">输入关键词，探索梦境世界</p>
      )}
    </div>
  )
}
