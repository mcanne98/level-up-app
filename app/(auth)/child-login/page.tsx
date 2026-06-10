'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ChildLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/child/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error || 'Invalid username or password.'); return }
    router.push(data.redirect || '/child/feed')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1a2e] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🎮</div>
          <h1 className="text-3xl font-black text-white">Let's Play!</h1>
          <p className="text-white/50 text-sm mt-2">Sign in with your username</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-white/60 text-xs font-medium block mb-1.5">Username</label>
            <input
              required
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase() }))}
              placeholder="panda-alex-4821"
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium block mb-1.5">Password</label>
            <div className="relative">
              <input
                required
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
              <button
                type="button"
                onClick={() => setShowPwd(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-lg"
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-base shadow-2xl shadow-violet-600/40 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-60 mt-1"
          >
            {loading ? 'Signing in…' : 'Start Learning! 🚀'}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          Ask a parent for your username and password.
        </p>
        <p className="text-center mt-3">
          <Link href="/parent-login" className="text-white/30 hover:text-white/60 text-xs">
            Parent login →
          </Link>
        </p>
      </div>
    </main>
  )
}
