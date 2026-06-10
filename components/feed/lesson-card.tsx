'use client'

import { useState } from 'react'
import type { Lesson } from '@/types'
import { getModeColor, getModeLabel, getModeEmoji, formatDuration } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
  lesson: Lesson
  onStart: (lesson: Lesson) => void
  isLocked?: boolean
  lockReason?: string
}

export function LessonCard({ lesson, onStart, isLocked, lockReason }: Props) {
  const [pressed, setPressed] = useState(false)

  const modeColor = getModeColor(lesson.mode)
  const modeLabel = getModeLabel(lesson.mode)
  const modeEmoji = getModeEmoji(lesson.mode)

  const bgGradients: Record<string, string> = {
    curiosity: 'from-yellow-900/80 to-orange-900/80',
    school: 'from-blue-900/80 to-indigo-900/80',
    mission_intro: 'from-emerald-900/80 to-teal-900/80',
  }

  return (
    <div
      className={`
        relative w-full rounded-3xl overflow-hidden border border-white/20
        bg-gradient-to-br ${bgGradients[lesson.mode] || 'from-slate-900/80 to-slate-800/80'}
        shadow-2xl transition-transform duration-150
        ${pressed ? 'scale-98' : 'scale-100'}
        ${isLocked ? 'opacity-75' : ''}
      `}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      {/* Top badges */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <Badge variant={lesson.mode as 'curiosity' | 'school' | 'mission'}>
          {modeEmoji} {modeLabel}
        </Badge>
        <Badge variant="outline">{lesson.subject}</Badge>
      </div>

      {/* Grade badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge variant="outline">Gr. {lesson.grade_min}{lesson.grade_min !== lesson.grade_max ? `–${lesson.grade_max}` : ''}</Badge>
      </div>

      {/* Main content */}
      <div className="pt-16 pb-6 px-6">
        {/* Emoji */}
        <div className="text-6xl mb-4 text-center">{lesson.thumbnail_emoji}</div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white text-center leading-tight mb-3">
          {lesson.title}
        </h2>

        {/* Hook */}
        <p className="text-white/70 text-center text-sm leading-relaxed mb-5 line-clamp-3">
          {lesson.hook}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-center gap-4 text-white/50 text-xs mb-5">
          <span>⏱ {formatDuration(lesson.estimated_duration_seconds)}</span>
          <span>⭐ {'★'.repeat(lesson.difficulty)}</span>
          {lesson.interest_tags.length > 0 && (
            <span>🏷 {lesson.interest_tags[0]}</span>
          )}
        </div>

        {/* Lock message */}
        {isLocked && lockReason && (
          <div className="bg-white/10 rounded-2xl p-3 text-center text-white/60 text-sm mb-4 border border-white/10">
            🔒 {lockReason}
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={() => !isLocked && onStart(lesson)}
          disabled={isLocked}
          size="lg"
          className="w-full"
          variant={lesson.mode === 'curiosity' ? 'xp' : lesson.mode === 'school' ? 'default' : 'success'}
        >
          {isLocked ? '🔒 Locked' : lesson.mode === 'curiosity' ? '✨ Explore Now' : lesson.mode === 'school' ? '📚 Start Lesson' : '🎯 Start Mission'}
        </Button>
      </div>
    </div>
  )
}
