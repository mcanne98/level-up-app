'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DEMO_CHAINS } from '@/lib/demo-data'
import type { Lesson } from '@/types'
import { getModeEmoji, getModeLabel } from '@/lib/utils'

export default function AdminLessonsPage() {
  const allLessons: Lesson[] = DEMO_CHAINS.flatMap(c => [c.curiosity_lesson, c.school_lesson])
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? allLessons : allLessons.filter(l => l.mode === filter)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] to-[#1a0a2e]">
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-black/30 backdrop-blur-md border-b border-white/10">
        <Link href="/admin/dashboard" className="text-white/60 hover:text-white">← Admin</Link>
        <h1 className="text-white font-black text-lg">Lessons</h1>
        <button className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-sm font-bold">+ New</button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {['all', 'curiosity', 'school', 'mission_intro'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === f ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {f === 'all' ? 'All' : `${getModeEmoji(f)} ${getModeLabel(f)}`}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map(lesson => (
            <div key={lesson.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{lesson.thumbnail_emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate">{lesson.title}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                      ✅ published
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/30 text-green-300 text-[10px] font-bold">
                      🔒 approved
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-[10px]">
                      {getModeEmoji(lesson.mode)} {getModeLabel(lesson.mode)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-[10px]">
                      Gr. {lesson.grade_min}–{lesson.grade_max}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-[10px]">
                      {lesson.subject}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-medium hover:bg-blue-500/40 transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 text-xs font-medium hover:bg-red-500/40 transition-colors">
                    Archive
                  </button>
                </div>
              </div>
              <p className="text-white/40 text-xs mt-3 line-clamp-2">{lesson.hook}</p>
            </div>
          ))}
        </div>

        {/* AI generation panel */}
        <div className="mt-6 bg-violet-900/20 rounded-3xl p-5 border border-violet-500/30">
          <h3 className="text-white font-black text-lg mb-2">🤖 AI Lesson Generator</h3>
          <p className="text-white/50 text-sm mb-4">
            Generate curriculum-aligned lessons automatically. Set ANTHROPIC_API_KEY to enable AI generation, or use the template engine.
          </p>
          <div className="flex flex-col gap-3">
            <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm">
              <option>Grade 6 — Math — Fractions</option>
              <option>Grade 5 — Science — Forces</option>
              <option>Grade 8 — Science — Systems</option>
            </select>
            <input
              placeholder="Interest anchor (e.g. Soccer, Minecraft, Space)"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30"
            />
            <button className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-colors">
              Generate Lesson ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
