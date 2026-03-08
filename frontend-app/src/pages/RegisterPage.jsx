import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFingerprint from '../hooks/useFingerprint'
import useAuthStore from '../stores/authStore'
import { useToast } from '../components/common/Toast'
import { SOCIAL_PLATFORMS } from '../utils/constants'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function RegisterPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { fingerprint, loading: fpLoading } = useFingerprint()
  const register = useAuthStore(s => s.register)

  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [socialLinks, setSocialLinks] = useState([])
  const [submitting, setSubmitting] = useState(false)

  function addSocialLink() {
    setSocialLinks([...socialLinks, { platform: 'twitter', value: '' }])
  }

  function updateSocialLink(index, field, val) {
    const updated = [...socialLinks]
    updated[index] = { ...updated[index], [field]: val }
    setSocialLinks(updated)
  }

  function removeSocialLink(index) {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nickname.trim()) {
      toast.error('请输入昵称')
      return
    }
    if (!fingerprint) {
      toast.error('正在生成设备指纹，请稍候')
      return
    }

    // 组装社交链接为 dict
    const links = {}
    socialLinks.forEach(({ platform, value }) => {
      if (value.trim()) {
        links[platform] = value.trim()
      }
    })

    setSubmitting(true)
    try {
      await register(fingerprint, nickname.trim(), email.trim(), links)
      toast.success('注册成功！')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.detail || '注册失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (fpLoading) {
    return (
      <div className="register-page">
        <LoadingSpinner />
        <div style={{ marginTop: 16, color: 'var(--text-secondary)' }}>正在识别设备...</div>
      </div>
    )
  }

  return (
    <div className="register-page fade-in">
      <div className="logo">🌙</div>
      <h1>梦境记录仪</h1>
      <div className="subtitle">记录你的梦境，获取 DreamCoin 代币奖励</div>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">昵称 *</label>
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="你的梦境昵称"
            maxLength={50}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">邮箱（选填）</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label className="form-label">社交链接（选填）</label>
          <div className="social-links-editor">
            {socialLinks.map((link, i) => (
              <div key={i} className="social-link-row">
                <select
                  value={link.platform}
                  onChange={e => updateSocialLink(i, 'platform', e.target.value)}
                >
                  {SOCIAL_PLATFORMS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <input
                  value={link.value}
                  onChange={e => updateSocialLink(i, 'value', e.target.value)}
                  placeholder="用户名或链接"
                />
                <button type="button" className="btn-remove" onClick={() => removeSocialLink(i)}>×</button>
              </div>
            ))}
            <button type="button" className="add-link-btn" onClick={addSocialLink}>+ 添加社交链接</button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting || !nickname.trim()}
          style={{ marginTop: 8 }}
        >
          {submitting ? '注册中...' : '开始记录梦境'}
        </button>

        <div className="form-hint" style={{ marginTop: 12, textAlign: 'center' }}>
          注册后请妥善保管 API Key，清除浏览器数据可能导致无法恢复
        </div>
      </form>
    </div>
  )
}
