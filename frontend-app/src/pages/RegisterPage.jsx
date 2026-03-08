import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFingerprint from '../hooks/useFingerprint'
import useAuthStore from '../stores/authStore'
import { useToast } from '../components/common/Toast'
import { SOCIAL_PLATFORMS } from '../utils/constants'
import { storage } from '../utils/storage'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function RegisterPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { fingerprint, loading: fpLoading } = useFingerprint()
  const register = useAuthStore(s => s.register)
  const loginWithKey = useAuthStore(s => s.loginWithKey)

  // 注册/登录模式切换
  const [mode, setMode] = useState('register') // 'register' | 'login'

  // 注册表单
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [socialLinks, setSocialLinks] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // 密钥保存 Modal
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [savedKey, setSavedKey] = useState('')
  const [keyConfirmed, setKeyConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)

  // 登录表单
  const [loginKey, setLoginKey] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

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

  // 复制密钥到剪贴板
  async function copyKey() {
    try {
      await navigator.clipboard.writeText(savedKey)
      setCopied(true)
      toast.success('已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 非 HTTPS 环境 fallback
      const textarea = document.createElement('textarea')
      textarea.value = savedKey
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        toast.success('已复制到剪贴板')
        setTimeout(() => setCopied(false), 2000)
      } catch {
        toast.error('复制失败，请手动复制')
      }
      document.body.removeChild(textarea)
    }
  }

  // 下载密钥文件
  function downloadKey() {
    storage.downloadApiKey(savedKey)
    toast.success('密钥文件已下载')
  }

  // 注册提交
  async function handleRegister(e) {
    e.preventDefault()
    if (!nickname.trim()) {
      toast.error('请输入昵称')
      return
    }
    if (!fingerprint) {
      toast.error('正在生成设备指纹，请稍候')
      return
    }

    const links = {}
    socialLinks.forEach(({ platform, value }) => {
      if (value.trim()) {
        links[platform] = value.trim()
      }
    })

    setSubmitting(true)
    try {
      const result = await register(fingerprint, nickname.trim(), email.trim(), links)
      setSavedKey(result.api_key)
      setShowKeyModal(true)
    } catch (err) {
      toast.error(err.response?.data?.detail || '注册失败')
    } finally {
      setSubmitting(false)
    }
  }

  // 密钥确认后进入首页
  function handleEnter() {
    setShowKeyModal(false)
    navigate('/', { replace: true })
  }

  // 密钥登录
  async function handleLogin(e) {
    e.preventDefault()
    const key = loginKey.trim()
    if (!key) {
      toast.error('请输入 API 密钥')
      return
    }

    setLoginLoading(true)
    try {
      await loginWithKey(key)
      toast.success('登录成功')
      navigate('/', { replace: true })
    } catch (err) {
      const msg = err.message || err.response?.data?.detail || '密钥验证失败'
      toast.error(msg)
    } finally {
      setLoginLoading(false)
    }
  }

  if (fpLoading && mode === 'register') {
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

      {/* 模式切换 Tab */}
      <div className="auth-tabs">
        <button
          className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
          onClick={() => setMode('register')}
        >
          注册
        </button>
        <button
          className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
          onClick={() => setMode('login')}
        >
          密钥登录
        </button>
      </div>

      {/* ===== 注册表单 ===== */}
      {mode === 'register' && (
        <form className="register-form fade-in" onSubmit={handleRegister}>
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
        </form>
      )}

      {/* ===== 密钥登录表单 ===== */}
      {mode === 'login' && (
        <form className="register-form fade-in" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">API 密钥</label>
            <input
              value={loginKey}
              onChange={e => setLoginKey(e.target.value)}
              placeholder="输入你的 API 密钥（dk_...）"
              autoFocus
            />
            <div className="form-hint">
              请输入注册时保存的 API 密钥来恢复你的账号
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loginLoading || !loginKey.trim()}
            style={{ marginTop: 8 }}
          >
            {loginLoading ? '验证中...' : '登录'}
          </button>
        </form>
      )}

      {/* ===== 密钥保存 Modal ===== */}
      {showKeyModal && (
        <div className="modal-overlay">
          <div className="modal-content key-save-modal">
            <div className="modal-title">请保存你的 API 密钥</div>
            <p className="key-save-warning">
              这是你唯一的身份凭证，清除浏览器数据或更换设备后需要用它重新登录。请务必保存！
            </p>

            <div className="api-key-box">
              <code>{savedKey}</code>
            </div>

            <div className="key-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={copyKey}
              >
                {copied ? '已复制' : '复制密钥'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={downloadKey}
              >
                下载密钥文件
              </button>
            </div>

            <label className="key-confirm-label">
              <input
                type="checkbox"
                checked={keyConfirmed}
                onChange={e => setKeyConfirmed(e.target.checked)}
              />
              <span>我已安全保存密钥</span>
            </label>

            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={!keyConfirmed}
              onClick={handleEnter}
            >
              进入梦境
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
