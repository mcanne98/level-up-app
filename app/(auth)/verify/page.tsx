'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function VerifyForm() {
  const router = useRouter()
  const params = useSearchParams()
  const emailFromUrl = params.get('email') || ''
  const devTokenFromUrl = params.get('dev') || ''

  const [email, setEmail] = useState(emailFromUrl)
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Pre-fill digits if dev token provided
  useEffect(() => {
    if (devTokenFromUrl.length === 6) {
      setDigits(devTokenFromUrl.split(''))
    }
  }, [devTokenFromUrl])

  // Resend countdown
  useEffect(() => {
    if (resendCountdown <= 0) return
    const timer = setInterval(() => setResendCountdown(c => c - 1), 1000)
    return () => clearInterval(timer)
  }, [resendCountdown])

  const tokenValue = digits.join('')

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value.slice(-1)
    setDigits(newDigits)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (tokenValue.length !== 6) { setError('Please enter all 6 digits.'); return }
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/parent/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token: tokenValue }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error || 'Verification failed.'); return }
    router.push(data.redirect || '/parent/children/new')
  }

  const handleResend = async () => {
    setResendCountdown(60)
    setError('')
    await fetch('/api/auth/parent/request-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1a2e] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">📩</div>
          <h1 className="text-3xl font-black text-white">Check your email</h1>
          <p className="text-white/50 text-sm mt-2 leading-relaxed">
            We sent a 6-digit code to<br />
            <span className="text-violet-400 font-medium">{email || 'your email'}</span>
          </p>
        </div>

        {/* Dev token hint */}
        {devTokenFromUrl && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-4 py-3 text-yellow-300 text-xs mb-5 text-center">
            🛠 Dev mode — code pre-filled: <strong>{devTokenFromUrl}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email field (editable) */}
          <div>
            <label className="text-white/60 text-xs font-medium block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* 6-digit OTP input */}
          <div>
            <label className="text-white/60 text-xs font-medium block mb-2.5 text-center">Verification Code</label>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-black bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:bg-violet-500/20 transition-all"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || tokenValue.length !== 6}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-base shadow-2xl shadow-violet-600/40 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying…' : 'Verify Code →'}
          </button>
        </form>

        <div className="text-center mt-5">
          {resendCountdown > 0 ? (
            <p className="text-white/30 text-sm">Resend in {resendCountdown}s</p>
          ) : (
            <button
              onClick={handleResend}
              className="text-violet-400 hover:text-violet-300 text-sm underline"
            >
              Resend code
            </button>
          )}
        </div>

        <p className="text-center mt-4">
          <Link href="/signup" className="text-white/30 hover:text-white/60 text-xs">
            ← Back to signup
          </Link>
        </p>
      </div>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}
