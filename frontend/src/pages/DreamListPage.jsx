import { useState, useEffect } from 'react'
import { fetchDreams } from '../api/client'
import DreamCard from '../components/DreamCard'
import Pagination from '../components/Pagination'

export default function DreamListPage() {
  const [data, setData] = useState({ dreams: [], total: 0, page: 1, total_pages: 0 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const result = await fetchDreams(page, 12)
        setData(result)
      } catch (err) {
        console.error('加载失败:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  return (
    <div className="dream-list-page">
      <div className="page-header">
        <h1>浏览梦境</h1>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <>
          <div className="dream-grid">
            {data.dreams.map(dream => (
              <DreamCard key={dream.id} dream={dream} />
            ))}
          </div>
          {data.dreams.length === 0 && (
            <p className="empty-state">暂无梦境记录</p>
          )}
          <Pagination
            page={data.page}
            totalPages={data.total_pages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
