'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AVATAR_EMOJIS, type AvatarAnimal } from '@/lib/auth/usernames'

interface Child {
  id: string
  firstName: string
  username: string
  avatarAnimal: AvatarAnimal
  avatarEmoji: string
  grade: number
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.children) setChildren(data.children)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] to-[#1a0a2e]">
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-black/30 backdrop-blur-md border-b border-white/10">
        <Link href="/parent/dashboard" className="text-white/60 hover:text-white">← Dashboard</Link>
        <h1 className="text-white font-black text-lg">Your Children</h1>
        <Link href="/parent/children/new" className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-sm font-bold">
          + Add
        </Link>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
        {loading && (
          <div className="text-center text-white/40 py-12">Loading…</div>
        )}

        {!loading && children.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👶</div>
            <p className="text-white font-bold text-lg mb-2">No children yet</p>
            <p className="text-white/40 text-sm mb-6">Add your first child to get started</p>
            <Link
              href="/parent/children/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-colors"
            >
              + Add Child
            </Link>
          </div>
        )}

        {children.map(child => (
          <div key={child.id} className="bg-white/5 rounded-3xl p-5 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{child.avatarEmoji}</div>
              <div className="flex-1">
                <p className="text-white font-black text-xl">{child.firstName}</p>
                <p className="text-white/50 text-sm">Grade {child.grade}</p>
                <p className="text-violet-400 font-mono text-sm mt-0.5">{child.username}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
