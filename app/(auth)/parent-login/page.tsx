'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ParentLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [devToken, setDevToken] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/parent/request-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setLoading(false)

    if (res.status === 429) { setError(data.error); return }

    if (data.devToken) setDevToken(data.devToken)
    setSent(true)

    setTimeout(() => {
      router.push(`/verify?email=${encodeURIComponent(email)}${data.devToken ? `&dev=${data.devToken}` : ''}`)
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1a2e] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">👨‍👩‍👧</div>
          <h1 className="text-3xl font-black text-white">Parent Login</h1>
          <p className="text-white/50 text-sm mt-2">We'll send a code to your email — no password needed.</p>
        </div>

        {sent ? (
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">📩</div>
            <p className="text-emerald-300 font-bold">Code sent!</p>
            <p className="text-white/50 text-sm mt-1">Redirecting to verification…</p>
            {devToken && (
              <p className="text-yellow-400 text-sm mt-3">
                🛠 Dev code: <strong>{devToken}</strong>
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-white/60 text-xs font-medium block mb-1.5">Parent Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-base shadow-2xl shadow-violet-600/40 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-60 mt-1"
            >
              {loading ? 'Sending…' : 'Send Login Code →'}
            </button>
          </form>
        )}

        <div className="text-center mt-6 flex flex-col gap-3">
          <Link href="/signup" className="text-violet-400 hover:text-violet-300 text-sm underline">
            Create a family account
          </Link>
          <Link href="/child-login" className="text-white/30 hover:text-white/60 text-xs">
            I'm a child →
          </Link>
        </div>
      </div>
    </main>
  )
}
