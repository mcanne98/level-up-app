'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AVATAR_ANIMALS, AVATAR_EMOJIS, type AvatarAnimal } from '@/lib/auth/usernames'

type Step = 'name' | 'avatar' | 'age-grade' | 'username' | 'password' | 'done'

interface ChildDraft {
  firstName: string
  avatarAnimal: AvatarAnimal
  age: number
  grade: number
  username: string
  password: string
  confirmPassword: string
}

interface CreatedChild {
  id: string
  firstName: string
  username: string
  avatarAnimal: AvatarAnimal
  avatarEmoji: string
  grade: number
}

const STEP_ORDER: Step[] = ['name', 'avatar', 'age-grade', 'username', 'password', 'done']

export default function NewChildPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('name')
  const [draft, setDraft] = useState<ChildDraft>({
    firstName: '', avatarAnimal: 'panda', age: 10, grade: 5,
    username: '', password: '', confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdChildren, setCreatedChildren] = useState<CreatedChild[]>([])
  const [latestChild, setLatestChild] = useState<CreatedChild | null>(null)

  const goNext = () => {
    const i = STEP_ORDER.indexOf(step)
    if (i < STEP_ORDER.length - 1) setStep(STEP_ORDER[i + 1])
  }

  const goPrev = () => {
    const i = STEP_ORDER.indexOf(step)
    if (i > 0) setStep(STEP_ORDER[i - 1])
  }

  const generateUsername = async () => {
    setLoading(true)
    const res = await fetch('/api/auth/child/generate-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: draft.firstName, avatarAnimal: draft.avatarAnimal }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.username) setDraft(d => ({ ...d, username: data.username }))
  }

  const handleSaveChild = async () => {
    if (draft.password !== draft.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/child/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName:    draft.firstName,
        avatarAnimal: draft.avatarAnimal,
        age:          draft.age,
        grade:        draft.grade,
        username:     draft.username,
        password:     draft.password,
        confirmPassword: draft.confirmPassword,
      }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error || 'Failed to create child.'); return }

    setLatestChild(data.child)
    setCreatedChildren(prev => [...prev, data.child])
    setStep('done')
  }

  const addAnother = () => {
    setDraft({ firstName: '', avatarAnimal: 'panda', age: 10, grade: 5, username: '', password: '', confirmPassword: '' })
    setStep('name')
    setLatestChild(null)
    setError('')
  }

  const stepIndex   = STEP_ORDER.indexOf(step)
  const totalSteps  = STEP_ORDER.length - 1 // exclude 'done'
  const progressPct = step === 'done' ? 100 : Math.round((stepIndex / totalSteps) * 100)

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1a2e] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/parent/dashboard" className="text-white/40 hover:text-white/70 text-sm">
            ← Dashboard
          </Link>
          <span className="text-white/40 text-xs">
            {step !== 'done' ? `Step ${stepIndex + 1} of ${totalSteps}` : 'Done!'}
          </span>
        </div>

        {/* Progress bar */}
        {step !== 'done' && (
          <div className="h-1.5 rounded-full bg-white/10 mb-8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}

        {/* ── Step: Name ── */}
        {step === 'name' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="text-6xl mb-3">👶</div>
              <h2 className="text-2xl font-black text-white">What&apos;s their name?</h2>
            </div>
            <input
              autoFocus
              value={draft.firstName}
              onChange={e => setDraft(d => ({ ...d, firstName: e.target.value }))}
              placeholder="First name"
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white text-xl font-bold text-center placeholder-white/30 focus:outline-none focus:border-violet-500"
              onKeyDown={e => e.key === 'Enter' && draft.firstName.trim() && goNext()}
            />
            <button
              disabled={!draft.firstName.trim()}
              onClick={goNext}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-base disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Next →
            </button>
          </div>
        )}

        {/* ── Step: Avatar ── */}
        {step === 'avatar' && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <div className="text-6xl mb-2">{AVATAR_EMOJIS[draft.avatarAnimal]}</div>
              <h2 className="text-2xl font-black text-white">Pick {draft.firstName}&apos;s avatar</h2>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_ANIMALS.map(animal => (
                <button
                  key={animal}
                  onClick={() => setDraft(d => ({ ...d, avatarAnimal: animal }))}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                    draft.avatarAnimal === animal
                      ? 'bg-violet-600/40 border-violet-500 scale-105'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="text-2xl">{AVATAR_EMOJIS[animal]}</span>
                  <span className="text-white/70 text-[10px] capitalize">{animal}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={goPrev} className="flex-1 h-12 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">
                ←
              </button>
              <button onClick={goNext} className="flex-[3] h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black hover:scale-[1.02] transition-transform">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step: Age & Grade ── */}
        {step === 'age-grade' && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <div className="text-6xl mb-2">🎒</div>
              <h2 className="text-2xl font-black text-white">How old is {draft.firstName}?</h2>
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium block mb-2">Age</label>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 15 }, (_, i) => i + 4).map(age => (
                  <button
                    key={age}
                    onClick={() => setDraft(d => ({ ...d, age }))}
                    className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${
                      draft.age === age
                        ? 'bg-violet-600 text-white scale-105'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium block mb-2">Grade</label>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                  <button
                    key={grade}
                    onClick={() => setDraft(d => ({ ...d, grade }))}
                    className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${
                      draft.grade === grade
                        ? 'bg-pink-600 text-white scale-105'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={goPrev} className="flex-1 h-12 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">←</button>
              <button onClick={goNext} className="flex-[3] h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black hover:scale-[1.02] transition-transform">Next →</button>
            </div>
          </div>
        )}

        {/* ── Step: Username ── */}
        {step === 'username' && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <div className="text-6xl mb-2">🏷️</div>
              <h2 className="text-2xl font-black text-white">{draft.firstName}&apos;s username</h2>
              <p className="text-white/50 text-sm mt-1">This is how they log in</p>
            </div>

            {draft.username ? (
              <div className="bg-white/5 border border-white/20 rounded-2xl p-5 text-center">
                <div className="text-4xl mb-2">{AVATAR_EMOJIS[draft.avatarAnimal]}</div>
                <p className="text-white font-mono text-xl font-bold tracking-wide">{draft.username}</p>
              </div>
            ) : (
              <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-8 text-center text-white/30">
                Tap generate to create a username
              </div>
            )}

            <button
              onClick={generateUsername}
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors"
            >
              {loading ? 'Generating…' : draft.username ? '🔄 Regenerate' : '✨ Generate Username'}
            </button>

            <div className="flex gap-3">
              <button onClick={goPrev} className="flex-1 h-12 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">←</button>
              <button
                disabled={!draft.username}
                onClick={goNext}
                className="flex-[3] h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black disabled:opacity-40 hover:scale-[1.02] transition-transform"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step: Password ── */}
        {step === 'password' && (
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <div className="text-6xl mb-2">🔑</div>
              <h2 className="text-2xl font-black text-white">Set a password</h2>
              <p className="text-white/50 text-sm mt-1">You&apos;ll give this to {draft.firstName}</p>
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium block mb-1.5">Password <span className="text-white/30">(min 6 characters)</span></label>
              <input
                type="password"
                value={draft.password}
                onChange={e => setDraft(d => ({ ...d, password: e.target.value }))}
                placeholder="••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium block mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={draft.confirmPassword}
                onChange={e => setDraft(d => ({ ...d, confirmPassword: e.target.value }))}
                placeholder="••••••"
                className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors ${
                  draft.confirmPassword && draft.password !== draft.confirmPassword
                    ? 'border-red-500/60'
                    : 'border-white/20 focus:border-violet-500'
                }`}
              />
              {draft.confirmPassword && draft.password !== draft.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-1">
              <button onClick={goPrev} className="flex-1 h-12 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">←</button>
              <button
                onClick={handleSaveChild}
                disabled={loading || draft.password.length < 6 || draft.password !== draft.confirmPassword}
                className="flex-[3] h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black disabled:opacity-40 hover:scale-[1.02] transition-transform"
              >
                {loading ? 'Saving…' : '✅ Save Child Profile'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step: Done ── */}
        {step === 'done' && latestChild && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <div className="text-6xl mb-2">🎉</div>
              <h2 className="text-2xl font-black text-white">Profile Created!</h2>
            </div>

            {/* Child login card */}
            <div className="bg-gradient-to-br from-violet-900/60 to-pink-900/60 rounded-3xl p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{latestChild.avatarEmoji}</div>
                <div>
                  <p className="text-white font-black text-xl">{latestChild.firstName}</p>
                  <p className="text-white/50 text-xs">Grade {latestChild.grade}</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-2xl p-4 space-y-3">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Username</p>
                  <p className="text-white font-mono font-bold text-lg tracking-wide">{latestChild.username}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Password</p>
                  <p className="text-white/60 text-sm">Set by parent ✓</p>
                </div>
              </div>
              <div className="mt-4 bg-yellow-500/20 rounded-xl px-4 py-3 border border-yellow-500/30">
                <p className="text-yellow-300 text-xs">
                  📝 <strong>Write this down!</strong> Give the username and password to {latestChild.firstName} so they can log in.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={addAnother}
                className="w-full h-12 rounded-2xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors"
              >
                + Add Another Child
              </button>
              <Link
                href="/parent/dashboard"
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black flex items-center justify-center hover:scale-[1.02] transition-transform"
              >
                Go to Dashboard →
              </Link>
            </div>

            {createdChildren.length > 1 && (
              <p className="text-white/30 text-xs text-center">
                {createdChildren.length} children added to your family
              </p>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
