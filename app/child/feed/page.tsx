'use client'

import { useState, useRef, useEffect } from 'react'
import { LessonCard } from '@/components/feed/lesson-card'
import { ChainProgressBar } from '@/components/feed/chain-progress-bar'
import { MentorBubble } from '@/components/feed/mentor-bubble'
import { XPToast } from '@/components/feed/xp-toast'
import { LessonViewer } from '@/components/lesson/lesson-viewer'
import type { Lesson, ChainProgress } from '@/types'
import { DEMO_CHAINS, DEMO_CHILD } from '@/lib/demo-data'
import Link from 'next/link'

export default function FeedPage() {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [xpToast, setXpToast] = useState<{ amount: number; message: string } | null>(null)
  const [chainProgress, setChainProgress] = useState<Record<string, Partial<ChainProgress>>>({})
  const [currentChainIndex, setCurrentChainIndex] = useState(0)

  const chain = DEMO_CHAINS[currentChainIndex]
  const progress = chainProgress[chain.id] || {}

  const mentorMessages = [
    `Hey ${DEMO_CHILD.display_name}! Ready to level up today? 🚀`,
    'Complete the full chain to unlock your reward! 🏆',
    'Every lesson brings you closer to mastery! ⭐',
    'You\'re on a roll! Keep it going! 🔥',
  ]
  const [mentorMsg] = useState(mentorMessages[Math.floor(Math.random() * mentorMessages.length)])

  const handleLessonComplete = (lesson: Lesson, score: number) => {
    const xp = lesson.mode === 'curiosity' ? 50 : lesson.mode === 'school' ? 100 : 150
    setXpToast({ amount: xp, message: lesson.mode === 'mission_intro' ? 'Mission started!' : 'Lesson complete!' })

    setChainProgress(prev => ({
      ...prev,
      [chain.id]: {
        ...prev[chain.id],
        curiosity_completed: prev[chain.id]?.curiosity_completed || lesson.mode === 'curiosity',
        school_completed: prev[chain.id]?.school_completed || lesson.mode === 'school',
        mission_completed: prev[chain.id]?.mission_completed || lesson.mode === 'mission_intro',
      },
    }))
    setActiveLesson(null)
  }

  const getNextStep = () => {
    if (!progress.curiosity_completed) return 'curiosity'
    if (!progress.school_completed) return 'school'
    if (!progress.mission_completed) return 'mission'
    return 'done'
  }

  const nextStep = getNextStep()
  const isRewardUnlocked =
    progress.curiosity_completed && progress.school_completed && progress.mission_completed

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] to-[#1a0a2e] flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-white/60 hover:text-white transition-colors">
          ←
        </Link>
        <div className="flex items-center gap-2">
          <div className="text-2xl">{DEMO_CHILD.avatar_url || '👤'}</div>
          <div>
            <p className="text-white font-bold text-sm leading-none">{DEMO_CHILD.display_name}</p>
            <p className="text-yellow-400 text-xs">Level {DEMO_CHILD.current_level} • {DEMO_CHILD.current_xp} XP</p>
          </div>
        </div>
        <Link href="/child/rewards" className="text-2xl">🏆</Link>
      </div>

      {/* Active lesson viewer */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-black">
          <LessonViewer
            lesson={activeLesson}
            onComplete={(score) => handleLessonComplete(activeLesson, score)}
            onClose={() => setActiveLesson(null)}
          />
        </div>
      )}

      {/* XP Toast */}
      {xpToast && (
        <XPToast
          amount={xpToast.amount}
          message={xpToast.message}
          onDone={() => setXpToast(null)}
        />
      )}

      {/* Main feed */}
      <div className="flex-1 pt-16 pb-6 px-4 flex flex-col gap-6 max-w-md mx-auto w-full">

        {/* Mentor bubble */}
        <div className="mt-4">
          <MentorBubble message={mentorMsg} avatarEmoji="🤖" />
        </div>

        {/* Chain progress */}
        <div className="bg-white/5 rounded-3xl border border-white/10 p-4">
          <p className="text-white/50 text-xs text-center mb-3 font-medium uppercase tracking-wider">Current Chain</p>
          <h2 className="text-white font-black text-xl text-center mb-4">{chain.title}</h2>
          <ChainProgressBar progress={progress} />

          {isRewardUnlocked && (
            <div className="mt-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 text-center border border-yellow-500/30">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-yellow-400 font-black text-lg">Chain Complete!</p>
              <p className="text-white/60 text-sm mt-1">+{chain.reward_value} XP unlocked</p>
              <Link
                href="/child/rewards"
                className="mt-3 block w-full py-2 rounded-xl bg-yellow-500 text-white font-bold text-sm hover:bg-yellow-400 transition-colors"
              >
                Claim Reward 🎁
              </Link>
            </div>
          )}
        </div>

        {/* Lesson cards */}
        <div className="flex flex-col gap-4">
          {/* Curiosity lesson */}
          {chain.curiosity_lesson && (
            <LessonCard
              lesson={chain.curiosity_lesson}
              onStart={setActiveLesson}
              isLocked={false}
            />
          )}

          {/* School lesson */}
          {chain.school_lesson && (
            <LessonCard
              lesson={chain.school_lesson}
              onStart={setActiveLesson}
              isLocked={!progress.curiosity_completed}
              lockReason="Complete the Curiosity lesson first!"
            />
          )}

          {/* Mission */}
          {chain.mission && (
            <div className="bg-gradient-to-br from-emerald-900/80 to-teal-900/80 rounded-3xl border border-white/20 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold">🎯 Mission</span>
              </div>
              <div className="text-5xl text-center mb-3">{chain.mission.emoji}</div>
              <h3 className="text-xl font-black text-white text-center mb-2">{chain.mission.title}</h3>
              <p className="text-white/70 text-sm text-center mb-4 leading-relaxed">{chain.mission.description}</p>
              <div className="flex items-center justify-center gap-3 text-white/50 text-xs mb-4">
                <span>+{chain.mission.xp_reward} XP</span>
                <span>•</span>
                <span className="capitalize">{chain.mission.proof_type.replace('_', ' ')}</span>
              </div>
              <button
                disabled={!progress.school_completed}
                className={`w-full py-3 rounded-2xl font-bold transition-all ${
                  progress.school_completed
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400 cursor-pointer'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                {progress.school_completed
                  ? progress.mission_completed ? '✅ Mission Done!' : '🎯 Accept Mission'
                  : '🔒 Complete School Mode first'}
              </button>
            </div>
          )}
        </div>

        {/* Chain switcher */}
        <div>
          <p className="text-white/40 text-xs text-center mb-3">More Learning Chains</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {DEMO_CHAINS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setCurrentChainIndex(i)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  i === currentChainIndex
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
