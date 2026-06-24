'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { Lesson, LearningChain, ChainProgress } from '@/types'
import { NarratedPlayer } from '@/components/lesson/narrated-player'
import { QuizOverlay } from '@/components/quiz/quiz-overlay'
import { XPToast } from '@/components/feed/xp-toast'
import { getModeEmoji, getModeLabel } from '@/lib/utils'
import Link from 'next/link'

type VideoItem = {
  lesson: Lesson
  chain: LearningChain
  locked: boolean
  lockReason?: string
}

interface Props {
  items: VideoItem[]
  childName: string
  childLevel: number
  childXP: number
  onLessonComplete: (lessonId: string, chainId: string, score: number) => void
  completedLessons: Set<string>
}

type ItemPhase = 'video' | 'quiz' | 'complete'

export function VideoFeed({ items, childName, childLevel, childXP, onLessonComplete, completedLessons }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [phases, setPhases] = useState<Record<string, ItemPhase>>({})
  const [xpToast, setXpToast] = useState<{ amount: number; message: string } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const setPhase = (lessonId: string, phase: ItemPhase) =>
    setPhases(p => ({ ...p, [lessonId]: phase }))

  const getPhase = (lessonId: string): ItemPhase => phases[lessonId] || 'video'

  // Snap scroll to active slide
  const scrollTo = useCallback((index: number) => {
    const el = containerRef.current?.children[index] as HTMLElement
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveIndex(index)
  }, [])

  // Observe which slide is in view
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            setActiveIndex(idx)
          }
        })
      },
      { threshold: 0.5 }
    )

    Array.from(container.children).forEach(child => observerRef.current?.observe(child))
    return () => observerRef.current?.disconnect()
  }, [items])

  const handleVideoComplete = (item: VideoItem) => {
    const { lesson, chain } = item
    if (lesson.quizzes && lesson.quizzes.length > 0) {
      setPhase(lesson.id, 'quiz')
    } else {
      finishLesson(lesson, chain, 100)
    }
  }

  const handleQuizComplete = (item: VideoItem, _correct: boolean, score: number) => {
    finishLesson(item.lesson, item.chain, score)
  }

  const finishLesson = (lesson: Lesson, chain: LearningChain, score: number) => {
    const xp = lesson.mode === 'curiosity' ? 50 : lesson.mode === 'school' ? 100 : 150
    setPhase(lesson.id, 'complete')
    setXpToast({ amount: xp, message: `+${xp} XP!` })
    onLessonComplete(lesson.id, chain.id, score)

    // Auto-advance to next after a beat
    const nextIdx = items.findIndex(i => i.lesson.id === lesson.id) + 1
    if (nextIdx < items.length) {
      setTimeout(() => scrollTo(nextIdx), 1800)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Header HUD */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="text-white/70 font-bold text-sm pointer-events-auto">
          <Link href="/" className="text-white/60 hover:text-white">← Feed</Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-black text-sm">Lv.{childLevel}</span>
          <span className="text-white/50 text-xs">{childXP} XP</span>
        </div>
      </div>

      {/* XP Toast */}
      {xpToast && (
        <div className="absolute inset-0 z-[60] pointer-events-none flex items-center justify-center">
          <XPToast amount={xpToast.amount} message={xpToast.message} onDone={() => setXpToast(null)} />
        </div>
      )}

      {/* Vertical snap scroll container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item, index) => {
          const { lesson, chain, locked, lockReason } = item
          const phase = getPhase(lesson.id)
          const isDone = completedLessons.has(lesson.id)

          return (
            <div
              key={lesson.id}
              data-index={index}
              className="w-full h-screen snap-start snap-always relative flex-shrink-0"
            >
              {/* Locked state */}
              {locked ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0f0a1e] px-8 text-center">
                  <div className="text-7xl mb-6 opacity-40">{lesson.thumbnail_emoji}</div>
                  <div className="text-5xl mb-4">🔒</div>
                  <h3 className="text-white font-black text-2xl mb-3">{lesson.title}</h3>
                  <p className="text-white/50 text-base">{lockReason}</p>
                  <button
                    onClick={() => scrollTo(index - 1)}
                    className="mt-6 px-6 py-3 rounded-2xl bg-violet-600 text-white font-bold"
                  >
                    Go Back ↑
                  </button>
                </div>
              ) : phase === 'video' && lesson.fallback_animation_json ? (
                <>
                  <NarratedPlayer
                    animation={lesson.fallback_animation_json}
                    narrationScript={buildNarration(lesson)}
                    onComplete={() => handleVideoComplete(item)}
                    autoPlay={index === activeIndex && !isDone}
                  />
                  {/* Side action bar */}
                  <SideBar lesson={lesson} chain={chain} isDone={isDone} />
                  {/* Bottom info */}
                  <BottomInfo lesson={lesson} chain={chain} />
                </>
              ) : phase === 'quiz' && lesson.quizzes?.[0] ? (
                <div className="w-full h-full bg-[#0f0a1e] overflow-y-auto">
                  <QuizOverlay
                    quiz={lesson.quizzes[0]}
                    onComplete={(correct, score) => handleQuizComplete(item, correct, score)}
                  />
                </div>
              ) : (
                // Complete state
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0f0a1e] px-8 text-center">
                  <div className="text-8xl mb-4">✅</div>
                  <h3 className="text-white font-black text-2xl mb-2">{lesson.title}</h3>
                  <p className="text-emerald-400 font-bold mb-6">Lesson Complete!</p>
                  {index + 1 < items.length && (
                    <button
                      onClick={() => scrollTo(index + 1)}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-lg"
                    >
                      Next Lesson ↓
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Scroll hint on first load */}
      {activeIndex === 0 && (
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none z-40">
          <div className="text-white/40 text-xs">Swipe up for next lesson</div>
          <div className="text-white/30 text-lg animate-bounce">↑</div>
        </div>
      )}
    </div>
  )
}

function SideBar({ lesson, chain, isDone }: { lesson: Lesson; chain: LearningChain; isDone: boolean }) {
  return (
    <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-1">
        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xl backdrop-blur-sm">
          {lesson.thumbnail_emoji}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xl backdrop-blur-sm">
          {getModeEmoji(lesson.mode)}
        </div>
        <span className="text-white/60 text-[10px] text-center leading-tight">{getModeLabel(lesson.mode)}</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="w-11 h-11 rounded-full bg-yellow-500/30 border border-yellow-500/50 flex items-center justify-center backdrop-blur-sm">
          <span className="text-yellow-400 font-black text-xs">
            +{lesson.mode === 'curiosity' ? 50 : lesson.mode === 'school' ? 100 : 150}
          </span>
        </div>
        <span className="text-white/50 text-[10px]">XP</span>
      </div>
      {isDone && (
        <div className="w-11 h-11 rounded-full bg-emerald-500/40 border border-emerald-500/60 flex items-center justify-center text-lg">
          ✅
        </div>
      )}
    </div>
  )
}

function BottomInfo({ lesson, chain }: { lesson: Lesson; chain: LearningChain }) {
  return (
    <div className="absolute bottom-0 left-0 right-14 z-20 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white/80 text-xs font-bold backdrop-blur-sm">
          {getModeEmoji(lesson.mode)} {getModeLabel(lesson.mode)}
        </span>
        <span className="text-white/40 text-xs">{lesson.subject}</span>
      </div>
      <h3 className="text-white font-black text-lg leading-tight mb-1">{lesson.title}</h3>
      <p className="text-white/60 text-sm leading-snug line-clamp-2">{lesson.hook}</p>
      <p className="text-violet-400 text-xs mt-2 font-medium">📚 {chain.title}</p>
    </div>
  )
}

function buildNarration(lesson: Lesson): string {
  const scenes = lesson.fallback_animation_json?.scenes ?? []
  // Build a flowing narration from scene texts, skipping celebration/question slides
  const lines = scenes
    .filter(s => s.type === 'fact' || s.type === 'title' || s.type === 'answer')
    .map(s => s.text)
  if (lines.length === 0) return lesson.script || lesson.hook
  return lines.join('. ')
}
