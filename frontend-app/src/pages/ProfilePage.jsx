import { useState } from 'react'
import useAuthStore from '../stores/authStore'
import { useToast } from '../components/common/Toast'
import { SOCIAL_PLATFORMS } from '../utils/constants'
import { formatDate, maskApiKey } from '../utils/format'
import { storage } from '../utils/storage'

export default function ProfilePage() {
  const toast = useToast()
  const { profile, updateProfile, logout } = useAuthStore()

  const [nickname, setNickname] = useState(profile?.nickname || '')
  const [email, setEmail] = useState(profile?.email || '')
  const [socialLinks, setSocialLinks] = useState(() => {
    const links = profile?.social_links || {}
    return Object.entries(links).map(([platform, value]) => ({ platform, value }))
  })
  const [saving, setSaving] = useState(false)

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

  async function handleSave() {
    if (!nickname.trim()) {
      toast.error('昵称不能为空')
      return
    }
    const links = {}
    socialLinks.forEach(({ platform, value }) => {
      if (value.trim()) links[platform] = value.trim()
    })

    setSaving(true)
    try {
      await updateProfile({
        nickname: nickname.trim(),
        email: email.trim(),
        social_links: links
      })
      toast.success('资料已更新')
    } catch (err) {
      toast.error(err.response?.data?.detail || '更新失败')
    } finally {
      setSaving(false)
    }
  }

  function handleCopyApiKey() {
    const apiKey = storage.getApiKey()
    navigator.clipboard.writeText(apiKey)
      .then(() => toast.success('API Key 已复制'))
      .catch(() => toast.error('复制失败'))
  }

  return (
    <div className="page fade-in">
      <div className="profile-header">
        <div className="profile-avatar">
          {(profile?.nickname || '?')[0].toUpperCase()}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>{profile?.nickname || '未知'}</div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="info-row">
          <span className="info-label">设备 ID</span>
          <span className="info-value">{profile?.device_id}</span>
        </div>
        <div className="info-row">
          <span className="info-label">注册时间</span>
          <span className="info-value">{formatDate(profile?.created_at)}</span>
        </div>
        <div style={{ padding: '8px 0' }}>
          <span className="info-label" style={{ marginBottom: 6, display: 'block' }}>API Key</span>
          <div className="api-key-display">
            <span style={{ flex: 1 }}>{maskApiKey(storage.getApiKey())}</span>
            <span className="copy-btn" onClick={handleCopyApiKey}>复制</span>
          </div>
          <div className="form-hint" style={{ marginTop: 4 }}>
            请妥善保管，清除浏览器数据后可能丢失
          </div>
        </div>
      </div>

      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>编辑资料</div>

      <div className="form-group">
        <label className="form-label">昵称</label>
        <input value={nickname} onChange={e => setNickname(e.target.value)} maxLength={50} />
      </div>

      <div className="form-group">
        <label className="form-label">邮箱</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={200} />
      </div>

      <div className="form-group">
        <label className="form-label">社交链接</label>
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

      <button className="btn btn-primary btn-block" onClick={handleSave} disabled={saving}>
        {saving ? '保存中...' : '保存修改'}
      </button>

      <div className="divider" style={{ margin: '24px 0' }} />

      <button
        className="btn btn-danger btn-block"
        onClick={() => {
          if (confirm('确定退出登录？退出后需要重新注册或恢复 API Key')) {
            logout()
            window.location.href = '/register'
          }
        }}
      >
        退出登录
      </button>
    </div>
  )
}
