import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicDream, lookupIdentity } from '../api/dreams'
import DreamContent from '../components/dream/DreamContent'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Modal from '../components/common/Modal'
import { useToast } from '../components/common/Toast'
import useTokenStore from '../stores/tokenStore'
import { IDENTITY_LOOKUP_COST } from '../utils/constants'

export default function DreamDetailPage() {
  const { id } = useParams()
  const toast = useToast()
  const refresh = useTokenStore(s => s.refresh)
  const [dream, setDream] = useState(null)
  const [loading, setLoading] = useState(true)

  // 身份查询
  const [showLookupModal, setShowLookupModal] = useState(false)
  const [identity, setIdentity] = useState(null)
  const [lookingUp, setLookingUp] = useState(false)

  useEffect(() => {
    setLoading(true)
    getPublicDream(id)
      .then(({ data }) => setDream(data))
      .catch(() => toast.error('梦境不存在'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleLookup() {
    setLookingUp(true)
    try {
      const { data } = await lookupIdentity(id)
      setIdentity(data)
      setShowLookupModal(false)
      refresh()
    } catch (err) {
      toast.error(err.response?.data?.detail || '查询失败')
    } finally {
      setLookingUp(false)
    }
  }

  if (loading) return <div className="page"><LoadingSpinner /></div>
  if (!dream) return <div className="page"><div className="empty-state"><div className="empty-text">梦境不存在</div></div></div>

  return (
    <div className="page fade-in">
      <DreamContent dream={dream} />

      <div style={{ marginTop: 20 }}>
        {identity ? (
          <div className="card identity-result">
            <div style={{ fontWeight: 600, marginBottom: 8 }}>发布者信息</div>
            {identity.email && (
              <div className="identity-item">
                <span className="info-label">邮箱</span>
                <span className="info-value">{identity.email}</span>
              </div>
            )}
            {identity.social_links && Object.entries(identity.social_links).map(([k, v]) => (
              <div key={k} className="identity-item">
                <span className="info-label">{k}</span>
                <span className="info-value">{v}</span>
              </div>
            ))}
            {identity.cached && (
              <div className="form-hint" style={{ marginTop: 8 }}>来自缓存（免费）</div>
            )}
          </div>
        ) : (
          <button
            className="btn btn-secondary btn-block"
            onClick={() => setShowLookupModal(true)}
          >
            🔍 查询发布者身份（{IDENTITY_LOOKUP_COST} DC）
          </button>
        )}
      </div>

      {/* 分享链接 */}
      <button
        className="btn btn-secondary btn-block"
        style={{ marginTop: 12 }}
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
            .then(() => toast.success('链接已复制'))
            .catch(() => toast.error('复制失败'))
        }}
      >
        📋 复制分享链接
      </button>

      <Modal
        open={showLookupModal}
        onClose={() => setShowLookupModal(false)}
        title="确认查询"
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => setShowLookupModal(false)}>取消</button>
            <button className="btn btn-primary" onClick={handleLookup} disabled={lookingUp}>
              {lookingUp ? '查询中...' : `确认（${IDENTITY_LOOKUP_COST} DC）`}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
          查询发布者的联系信息将消费 {IDENTITY_LOOKUP_COST} DreamCoin。
          <br />结果缓存 24 小时内重复查询免费。
        </p>
      </Modal>
    </div>
  )
}
