import { useState, useEffect } from 'react'

const FALLBACK_FP_KEY = 'dream_fp_fallback'

export default function useFingerprint() {
  const [fingerprint, setFingerprint] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const FingerprintJS = await import('@fingerprintjs/fingerprintjs')
        const fp = await FingerprintJS.load()
        const result = await fp.get()
        if (!cancelled) {
          setFingerprint(result.visitorId)
          setLoading(false)
        }
      } catch {
        // 回退：优先从 localStorage 读取缓存的 UUID，避免重复注册
        if (!cancelled) {
          let fallback = localStorage.getItem(FALLBACK_FP_KEY)
          if (!fallback) {
            fallback = 'fp_' + crypto.randomUUID().replace(/-/g, '').slice(0, 32)
            localStorage.setItem(FALLBACK_FP_KEY, fallback)
          }
          setFingerprint(fallback)
          setLoading(false)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { fingerprint, loading }
}
