'use client'

import Link from 'next/link'
import { SEED_ONTARIO_CURRICULUM } from '@/db/seed'

export default function CurriculumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] to-[#1a0a2e]">
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-black/30 backdrop-blur-md border-b border-white/10">
        <Link href="/admin/dashboard" className="text-white/60 hover:text-white">← Admin</Link>
        <h1 className="text-white font-black text-lg">Curriculum Manager</h1>
        <button className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-sm font-bold">Import</button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Regions */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-4">📍 Curriculum Regions</h3>
          <div className="flex items-center gap-4 bg-violet-500/20 rounded-2xl p-4 border border-violet-500/30">
            <div className="text-3xl">🇨🇦</div>
            <div>
              <p className="text-white font-bold">{SEED_ONTARIO_CURRICULUM.region.name}</p>
              <p className="text-white/50 text-xs">{SEED_ONTARIO_CURRICULUM.region.province_or_state}, {SEED_ONTARIO_CURRICULUM.region.country}</p>
              <p className="text-white/40 text-xs">Version: {SEED_ONTARIO_CURRICULUM.region.version}</p>
            </div>
            <span className="ml-auto px-2 py-1 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold">Active</span>
          </div>
          <p className="text-white/30 text-xs mt-3">
            Future regions: BC, Alberta, other Canadian provinces, US states, UK, international curricula.
          </p>
        </div>

        {/* Sample courses */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-4">📚 Courses</h3>
          <div className="flex flex-col gap-2">
            {SEED_ONTARIO_CURRICULUM.sample_courses.map((course, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/10 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{course.name}</p>
                  <p className="text-white/40 text-xs">Grade {course.grade} • {course.subject}</p>
                </div>
                <span className="text-white/40 text-xs">→</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample expectations */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-4">📋 Sample Expectations</h3>
          <div className="flex flex-col gap-3">
            {SEED_ONTARIO_CURRICULUM.sample_expectations.map((exp, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 text-xs font-mono">{exp.code}</span>
                  <span className="text-white/40 text-xs">{exp.course}</span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-2">{exp.text}</p>
                <div className="flex flex-wrap gap-1">
                  {exp.concepts.map(c => (
                    <span key={c.name} className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Import panel */}
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="text-white font-black text-lg mb-2">📥 Import Curriculum</h3>
          <p className="text-white/50 text-sm mb-4">Upload CSV or JSON files with curriculum expectations.</p>
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-2">📂</div>
            <p className="text-white/40 text-sm">Drop a CSV or JSON file here</p>
            <p className="text-white/20 text-xs mt-1">or use POST /api/admin/curriculum/import</p>
          </div>
        </div>
      </div>
    </div>
  )
}
