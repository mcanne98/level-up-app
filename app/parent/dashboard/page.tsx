'use client'

import Link from 'next/link'
import { DEMO_CHILD, DEMO_BADGES, DEMO_PARENT_REWARDS, DEMO_CHAINS } from '@/lib/demo-data'
import { Progress } from '@/components/ui/progress'
import { xpProgressPercent } from '@/lib/utils'

const CONVERSATION_PROMPTS = [
  `Ask ${DEMO_CHILD.first_name}: "What did you learn about forces today?"`,
  `Try: "Can you explain Newton's Laws to me like I'm 5?"`,
  `Challenge: "Find something in the kitchen that shows friction."`,
  `Ask: "What mission are you working on? Can I help?"`,
]

export default function ParentDashboardPage() {
  const stats = {
    learningMinutes: 47,
    xpEarned: 350,
    lessonsCompleted: 4,
    missionsCompleted: 1,
    currentStreak: 3,
  }

  const subjects = [
    { name: 'Science', strength: 72, color: 'bg-green-500' },
    { name: 'Math', strength: 58, color: 'bg-blue-500' },
    { name: 'Language', strength: 35, color: 'bg-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] to-[#1a0a2e]">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-black/30 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-white/60 hover:text-white transition-colors">
          ← Home
        </Link>
        <h1 className="text-white font-black text-lg">Parent Dashboard</h1>
        <Link href="/parent/settings" className="text-white/60 hover:text-white text-sm">
          ⚙️
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Child overview */}
        <div className="bg-gradient-to-br from-violet-900/60 to-pink-900/60 rounded-3xl p-6 border border-white/20">
          <div className="flex items-center gap-4 mb-5">
            <div className="text-5xl">{DEMO_CHILD.avatar_url}</div>
            <div>
              <h2 className="text-white font-black text-2xl">{DEMO_CHILD.first_name}</h2>
              <p className="text-white/60 text-sm">Grade {DEMO_CHILD.grade} • {DEMO_CHILD.province}, {DEMO_CHILD.country}</p>
              <p className="text-yellow-400 text-sm font-bold">Level {DEMO_CHILD.current_level} • {DEMO_CHILD.current_xp} XP</p>
            </div>
          </div>
          <Progress value={xpProgressPercent(DEMO_CHILD.current_xp)} className="mb-1" />
          <p className="text-white/40 text-xs">Progress to Level {DEMO_CHILD.current_level + 1}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Minutes', value: stats.learningMinutes, emoji: '⏱' },
            { label: 'XP Earned', value: stats.xpEarned, emoji: '⭐' },
            { label: 'Lessons', value: stats.lessonsCompleted, emoji: '📚' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-white font-black text-xl">{s.value}</div>
              <div className="text-white/40 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Subject strengths */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-4">Subject Progress</h3>
          <div className="flex flex-col gap-3">
            {subjects.map(s => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/80 text-sm font-medium">{s.name}</span>
                  <span className="text-white/50 text-xs">{s.strength}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all duration-700`}
                    style={{ width: `${s.strength}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-4">
            Language needs more practice — the app will prioritize it.
          </p>
        </div>

        {/* Current learning chains */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-4">Active Learning Chains</h3>
          <div className="flex flex-col gap-3">
            {DEMO_CHAINS.map(chain => (
              <div key={chain.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-bold text-sm">{chain.title}</p>
                  <span className="text-white/40 text-xs">Grade {chain.grade_min}–{chain.grade_max}</span>
                </div>
                <div className="flex gap-2">
                  {['✨ Curiosity', '📚 School', '🎯 Mission'].map((step, i) => (
                    <span
                      key={step}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        i === 0 ? 'bg-yellow-500/30 text-yellow-300' : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation prompts */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-2">💬 Conversation Starters</h3>
          <p className="text-white/40 text-xs mb-4">Based on what {DEMO_CHILD.first_name} is learning today:</p>
          <div className="flex flex-col gap-2">
            {CONVERSATION_PROMPTS.map((prompt, i) => (
              <div key={i} className="bg-violet-500/20 rounded-xl p-3 border border-violet-500/20">
                <p className="text-white/80 text-sm">{prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reward requests */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-4">🎁 Reward Requests</h3>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <p className="text-white/40 text-sm">No pending reward requests.</p>
            <p className="text-white/20 text-xs mt-1">Requests will appear here when {DEMO_CHILD.first_name} redeems XP for rewards.</p>
          </div>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/parent/children"
            className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center hover:bg-white/10 transition-colors"
          >
            <div className="text-3xl mb-2">👨‍👩‍👧</div>
            <p className="text-white text-sm font-bold">Manage Children</p>
          </Link>
          <Link
            href="/parent/settings"
            className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center hover:bg-white/10 transition-colors"
          >
            <div className="text-3xl mb-2">⚙️</div>
            <p className="text-white text-sm font-bold">Settings</p>
          </Link>
        </div>

        {/* Safety disclaimer */}
        <p className="text-white/20 text-xs text-center leading-relaxed pb-4">
          Level Up is aligned to curriculum concepts and intended as a learning companion. Not a replacement for classroom instruction. No child data is shared publicly.
        </p>
      </div>
    </div>
  )
}
