import { useState } from 'react'
import { useToast } from '../common/Toast'
import { postDream } from '../../api/dreams'
import useTokenStore from '../../stores/tokenStore'
import { MIN_CONTENT_LENGTH, REWARD_DREAM_POST } from '../../utils/constants'

export default function DreamForm({ onSuccess }) {
  const toast = useToast()
  const refresh = useTokenStore(s => s.refresh)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = title.trim() && content.trim().length >= MIN_CONTENT_LENGTH && !submitting

  function handleTagKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const tag = tagInput.trim().replace(/,/g, '')
      if (tag && !tags.includes(tag) && tags.length < 10) {
        setTags([...tags, tag])
      }
      setTagInput('')
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await postDream({
        title: title.trim(),
        content: content.trim(),
        dream_type: 'human',
        tags
      })
      toast.success('梦境发布成功！')
      refresh()
      onSuccess?.()
    } catch (err) {
      toast.error(err.response?.data?.detail || '发布失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="dream-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">梦境标题</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="给这个梦起个名字..."
          maxLength={200}
        />
      </div>

      <div className="form-group">
        <label className="form-label">梦境内容</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={`描述你的梦境（至少 ${MIN_CONTENT_LENGTH} 字）...`}
          maxLength={10000}
          rows={8}
        />
        <div className="char-count">
          {content.length} / 10000
          {content.length < MIN_CONTENT_LENGTH && content.length > 0 && (
            <span style={{ color: 'var(--danger)', marginLeft: 8 }}>
              还需 {MIN_CONTENT_LENGTH - content.length} 字
            </span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">标签（最多10个，按回车添加）</label>
        <div className="tags-input" onClick={() => document.getElementById('tag-input')?.focus()}>
          {tags.map(tag => (
            <span key={tag} className="tag-chip">
              {tag}
              <span className="remove" onClick={() => setTags(tags.filter(t => t !== tag))}>×</span>
            </span>
          ))}
          <input
            id="tag-input"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? '输入标签...' : ''}
          />
        </div>
      </div>

      {content.length >= MIN_CONTENT_LENGTH && (
        <div className="reward-estimate">
          💎 预估奖励：约 {REWARD_DREAM_POST} DC
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={!canSubmit}
        style={{ marginTop: 20 }}
      >
        {submitting ? '发布中...' : '发布梦境'}
      </button>
    </form>
  )
}
