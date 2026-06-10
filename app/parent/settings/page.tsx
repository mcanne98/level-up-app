'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DEMO_CHILD } from '@/lib/demo-data'

export default function ParentSettingsPage() {
  const [timeLimit, setTimeLimit] = useState(DEMO_CHILD.daily_time_limit_minutes)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] to-[#1a0a2e]">
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-black/30 backdrop-blur-md border-b border-white/10">
        <Link href="/parent/dashboard" className="text-white/60 hover:text-white">← Back</Link>
        <h1 className="text-white font-black text-lg">Settings</h1>
        <div className="w-12" />
      </div>

      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-5">
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-4">⏱ Daily Time Limit</h3>
          <p className="text-white/50 text-sm mb-4">
            Set how many minutes per day {DEMO_CHILD.first_name} can use Level Up.
          </p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={15}
              max={180}
              step={15}
              value={timeLimit}
              onChange={e => setTimeLimit(Number(e.target.value))}
              className="flex-1 accent-violet-500"
            />
            <span className="text-white font-bold text-lg w-16 text-right">{timeLimit} min</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-4">🔒 Safety Controls</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'No public child profile', enabled: true },
              { label: 'No comments or DMs', enabled: true },
              { label: 'Admin-reviewed content only', enabled: true },
              { label: 'Parent reward approval required', enabled: true },
              { label: 'Age & grade content filtering', enabled: true },
            ].map(control => (
              <div key={control.label} className="flex items-center justify-between">
                <span className="text-white/70 text-sm">{control.label}</span>
                <div className={`w-10 h-6 rounded-full flex items-center px-1 ${control.enabled ? 'bg-emerald-500' : 'bg-white/20'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${control.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-4">
            Core safety controls cannot be disabled. Level Up was built with child safety as a non-negotiable requirement.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-violet-600 text-white font-bold text-base hover:bg-violet-500 transition-colors"
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
