'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [devToken, setDevToken] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/parent/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error || 'Something went wrong.'); return }

    if (data.devToken) setDevToken(data.devToken)

    // Pass email to verify page via query string
    router.push(`/verify?email=${encodeURIComponent(form.email)}${data.devToken ? `&dev=${data.devToken}` : ''}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1a2e] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🚀</div>
          <h1 className="text-3xl font-black text-white">Level Up</h1>
          <p className="text-white/50 text-sm mt-1">Create your family account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/60 text-xs font-medium block mb-1.5">First Name</label>
              <input
                required
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                placeholder="Anne"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs font-medium block mb-1.5">Last Name</label>
              <input
                required
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                placeholder="Smith"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="text-white/60 text-xs font-medium block mb-1.5">Parent Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
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
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-base shadow-2xl shadow-violet-600/40 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? 'Sending code…' : 'Create Family Account →'}
          </button>
        </form>

        <p className="text-center text-white/40 text-xs mt-6">
          Already have an account?{' '}
          <Link href="/parent-login" className="text-violet-400 hover:text-violet-300 underline">
            Parent Login
          </Link>
        </p>
        <p className="text-center mt-4">
          <Link href="/child-login" className="text-white/30 hover:text-white/60 text-xs transition-colors">
            I'm a child — Go to Child Login →
          </Link>
        </p>
      </div>
    </main>
  )
}
