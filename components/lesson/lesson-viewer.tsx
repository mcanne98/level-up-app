'use client'

import { useState } from 'react'
import type { Lesson } from '@/types'
import { AnimatedLessonPlayer } from './animated-lesson-player'
import { QuizOverlay } from '@/components/quiz/quiz-overlay'
import { Button } from '@/components/ui/button'
import { getModeEmoji, getModeLabel } from '@/lib/utils'

type Phase = 'intro' | 'lesson' | 'quiz' | 'complete'

interface Props {
  lesson: Lesson
  onComplete: (score: number) => void
  onClose: () => void
}

export function LessonViewer({ lesson, onComplete, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [quizScore, setQuizScore] = useState(0)

  const hasQuiz = lesson.quizzes && lesson.quizzes.length > 0
  const quiz = lesson.quizzes?.[0]

  const handleLessonComplete = () => {
    if (hasQuiz) {
      setPhase('quiz')
    } else {
      setPhase('complete')
    }
  }

  const handleQuizComplete = (correct: boolean, score: number) => {
    setQuizScore(score)
    setPhase('complete')
  }

  if (phase === 'intro') {
    return (
      <div
        className="h-full flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: '#0f0a1e' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20"
        >
          ✕
        </button>
        <div className="text-7xl mb-5">{lesson.thumbnail_emoji}</div>
        <div className="mb-3">
          <span className="px-3 py-1 rounded-full bg-violet-600/50 text-violet-200 text-xs font-bold">
            {getModeEmoji(lesson.mode)} {getModeLabel(lesson.mode)}
          </span>
        </div>
        <h1 className="text-3xl font-black text-white mb-4 leading-tight">{lesson.title}</h1>
        <p className="text-white/60 text-base mb-8 leading-relaxed max-w-sm">{lesson.hook}</p>
        <div className="flex items-center gap-4 text-white/40 text-sm mb-8">
          <span>⏱ ~{Math.ceil(lesson.estimated_duration_seconds / 60)} min</span>
          <span>📚 {lesson.subject}</span>
          <span>⭐ {'★'.repeat(lesson.difficulty)}</span>
        </div>
        <Button size="xl" className="w-full max-w-xs" onClick={() => setPhase('lesson')}>
          Let's Go! 🚀
        </Button>
      </div>
    )
  }

  if (phase === 'lesson' && lesson.fallback_animation_json) {
    return (
      <div className="h-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white/70 hover:bg-black/60"
        >
          ✕
        </button>
        <AnimatedLessonPlayer
          animation={lesson.fallback_animation_json}
          onComplete={handleLessonComplete}
        />
      </div>
    )
  }

  if (phase === 'quiz' && quiz) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center overflow-y-auto"
        style={{ backgroundColor: '#0f0a1e' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70"
        >
          ✕
        </button>
        <QuizOverlay quiz={quiz} onComplete={handleQuizComplete} />
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <div
        className="h-full flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: '#0f0a1e' }}
      >
        <div className="text-8xl mb-4">🎉</div>
        <h2 className="text-4xl font-black text-white mb-3">Lesson Complete!</h2>
        <p className="text-white/60 mb-2">{lesson.title}</p>
        {quizScore > 0 && (
          <div className="bg-emerald-500/20 rounded-2xl px-6 py-3 mb-6 border border-emerald-500/30">
            <p className="text-emerald-400 font-bold">Quiz Score: {quizScore}%</p>
          </div>
        )}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl px-8 py-4 mb-8 border border-yellow-500/30">
          <p className="text-yellow-400 font-black text-2xl">
            +{lesson.mode === 'curiosity' ? 50 : lesson.mode === 'school' ? 100 : 150} XP
          </p>
          <p className="text-white/60 text-sm mt-1">
            {lesson.mode === 'school' ? 'School Mode complete! Mission unlocked! 🔓' : 'Keep going! 🚀'}
          </p>
        </div>
        <Button size="xl" className="w-full max-w-xs" onClick={() => onComplete(quizScore)}>
          Continue →
        </Button>
      </div>
    )
  }

  return null
}
