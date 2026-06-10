'use client'

import Link from 'next/link'
import { DEMO_CHAINS } from '@/lib/demo-data'

const LESSON_STATS = {
  draft: 5,
  review: 3,
  published: 8,
  archived: 2,
}

export default function AdminDashboardPage() {
  const allLessons = DEMO_CHAINS.flatMap(c => [c.curiosity_lesson, c.school_lesson])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] to-[#1a0a2e]">
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-black/30 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-white/60 hover:text-white">← Home</Link>
        <h1 className="text-white font-black text-lg">Admin Dashboard</h1>
        <Link href="/admin/lessons" className="text-violet-400 text-sm hover:text-violet-300">Lessons</Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Content status overview */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Draft', count: LESSON_STATS.draft, color: 'bg-slate-500/30 border-slate-500/40', emoji: '📝' },
            { label: 'In Review', count: LESSON_STATS.review, color: 'bg-yellow-500/30 border-yellow-500/40', emoji: '👁️' },
            { label: 'Published', count: LESSON_STATS.published, color: 'bg-emerald-500/30 border-emerald-500/40', emoji: '✅' },
            { label: 'Archived', count: LESSON_STATS.archived, color: 'bg-white/10 border-white/10', emoji: '📦' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-5 border ${s.color} text-center`}>
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="text-white font-black text-3xl">{s.count}</div>
              <div className="text-white/60 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/admin/lessons" className="bg-violet-600/20 border border-violet-600/40 rounded-2xl p-4 hover:bg-violet-600/30 transition-colors">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-white font-bold">Manage Lessons</p>
            <p className="text-white/50 text-xs mt-1">Create, review, publish content</p>
          </Link>
          <Link href="/admin/curriculum" className="bg-blue-600/20 border border-blue-600/40 rounded-2xl p-4 hover:bg-blue-600/30 transition-colors">
            <div className="text-3xl mb-2">🎓</div>
            <p className="text-white font-bold">Curriculum Map</p>
            <p className="text-white/50 text-xs mt-1">Ontario & other standards</p>
          </Link>
        </div>

        {/* Recent lessons */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-black text-lg">Recent Lessons</h3>
            <Link href="/admin/lessons" className="text-violet-400 text-sm">View all →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {allLessons.map(lesson => (
              <div key={lesson.id} className="flex items-center gap-4 bg-white/5 rounded-2xl p-3 border border-white/10">
                <div className="text-3xl">{lesson.thumbnail_emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{lesson.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold">published</span>
                    <span className="text-white/40 text-xs">Gr. {lesson.grade_min}–{lesson.grade_max}</span>
                    <span className="text-white/40 text-xs">{lesson.mode}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-green-500/30 text-green-300 text-[10px] font-bold">✓ Safe</span>
              </div>
            ))}
          </div>
        </div>

        {/* Video jobs */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-4">🎬 Video Jobs</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm">Current provider:</span>
            <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-300 text-xs font-bold">Fallback Animation</span>
          </div>
          <p className="text-white/40 text-xs">
            No active video generation jobs. The app is using the built-in fallback animated lesson generator.
            Configure VIDEO_PROVIDER=mcp to enable MCP video generation.
          </p>
        </div>

        {/* Curriculum coverage */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-4">📊 Ontario Curriculum Coverage</h3>
          <div className="flex flex-col gap-2">
            {[
              { grade: 'Grade 5–7 Science', concepts: 4, covered: 3 },
              { grade: 'Grade 4–6 Math', concepts: 6, covered: 2 },
              { grade: 'Grade 3 Language', concepts: 8, covered: 0 },
            ].map(row => (
              <div key={row.grade} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                <span className="text-white/70 text-sm">{row.grade}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-xs">{row.covered}/{row.concepts} concepts</span>
                  <div className="w-20 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${(row.covered / row.concepts) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/curriculum" className="block mt-4 text-center text-violet-400 text-sm hover:text-violet-300">
            Manage curriculum →
          </Link>
        </div>
      </div>
    </div>
  )
}
