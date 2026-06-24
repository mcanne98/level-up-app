'use client'

import { useState } from 'react'
import { VideoFeed } from '@/components/feed/video-feed'
import { DEMO_CHAINS, DEMO_CHILD } from '@/lib/demo-data'
import type { ChainProgress } from '@/types'

export default function FeedPage() {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [chainProgress, setChainProgress] = useState<Record<string, Partial<ChainProgress>>>({})
  const [xp, setXp] = useState(DEMO_CHILD.current_xp)

  const handleLessonComplete = (lessonId: string, chainId: string, score: number) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]))

    // Determine which step this is
    const chain = DEMO_CHAINS.find(c => c.id === chainId)
    if (!chain) return

    const isCuriosity = chain.curiosity_lesson?.id === lessonId
    const isSchool = chain.school_lesson?.id === lessonId

    setChainProgress(prev => ({
      ...prev,
      [chainId]: {
        ...prev[chainId],
        curiosity_completed: prev[chainId]?.curiosity_completed || isCuriosity,
        school_completed: prev[chainId]?.school_completed || isSchool,
      },
    }))

    const earned = isCuriosity ? 50 : isSchool ? 100 : 150
    setXp(prev => prev + earned)
  }

  // Flatten all chains into a single ordered video feed
  // Order: curiosity → school → (next chain curiosity) → (next chain school) ...
  const feedItems = DEMO_CHAINS.flatMap(chain => {
    const progress = chainProgress[chain.id] || {}
    const items = []

    if (chain.curiosity_lesson) {
      items.push({ lesson: chain.curiosity_lesson, chain, locked: false })
    }
    if (chain.school_lesson) {
      items.push({
        lesson: chain.school_lesson,
        chain,
        locked: !progress.curiosity_completed,
        lockReason: 'Complete the Curiosity lesson first! ↑',
      })
    }
    return items
  })

  return (
    <VideoFeed
      items={feedItems}
      childName={DEMO_CHILD.display_name}
      childLevel={DEMO_CHILD.current_level}
      childXP={xp}
      onLessonComplete={handleLessonComplete}
      completedLessons={completedLessons}
    />
  )
}
