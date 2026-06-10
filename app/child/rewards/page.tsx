'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DEMO_BADGES, DEMO_PARENT_REWARDS, DEMO_CHILD } from '@/lib/demo-data'
import { xpProgressPercent, xpForNextLevel } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

export default function RewardsPage() {
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [redeemed, setRedeemed] = useState<string[]>([])

  const xpPercent = xpProgressPercent(DEMO_CHILD.current_xp)
  const nextLevelXp = xpForNextLevel(DEMO_CHILD.current_level)

  const handleRedeem = (rewardId: string) => {
    setRedeeming(rewardId)
    setTimeout(() => {
      setRedeemed(prev => [...prev, rewardId])
      setRedeeming(null)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a1e] to-[#1a0a2e]">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 bg-black/30 backdrop-blur-md border-b border-white/10">
        <Link href="/child/feed" className="text-white/60 hover:text-white transition-colors">
          ← Back
        </Link>
        <h1 className="text-white font-black text-xl flex-1 text-center">Your Rewards 🏆</h1>
        <div className="w-12" />
      </div>

      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        {/* XP & Level card */}
        <div className="bg-gradient-to-br from-violet-900/60 to-pink-900/60 rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm">Current Level</p>
              <p className="text-white font-black text-4xl">Level {DEMO_CHILD.current_level}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Total XP</p>
              <p className="text-yellow-400 font-black text-2xl">{DEMO_CHILD.current_xp}</p>
            </div>
          </div>
          <Progress value={xpPercent} className="mb-2" />
          <p className="text-white/40 text-xs text-center">
            {DEMO_CHILD.current_xp} / {nextLevelXp} XP to Level {DEMO_CHILD.current_level + 1}
          </p>
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-white font-black text-lg mb-3">Badges</h2>
          <div className="grid grid-cols-4 gap-3">
            {DEMO_BADGES.map(badge => (
              <div
                key={badge.id}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
                  badge.earned
                    ? 'bg-yellow-500/20 border-yellow-500/40'
                    : 'bg-white/5 border-white/10 opacity-40'
                }`}
              >
                <div className={`text-3xl ${badge.earned ? '' : 'grayscale'}`}>{badge.emoji}</div>
                <p className="text-white text-[10px] font-medium text-center leading-tight">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Parent rewards */}
        <div>
          <h2 className="text-white font-black text-lg mb-1">Earn Real Rewards</h2>
          <p className="text-white/40 text-xs mb-4">Complete learning chains to earn coins. Spend them on rewards!</p>
          <div className="flex flex-col gap-3">
            {DEMO_PARENT_REWARDS.map(reward => {
              const canAfford = DEMO_CHILD.current_xp >= reward.cost_points
              const isRedeemed = redeemed.includes(reward.id)
              const isRedeeming = redeeming === reward.id

              return (
                <div
                  key={reward.id}
                  className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <div className="text-4xl">{reward.emoji}</div>
                  <div className="flex-1">
                    <p className="text-white font-bold">{reward.title}</p>
                    <p className="text-white/50 text-xs">{reward.description}</p>
                    <p className="text-yellow-400 text-xs font-bold mt-1">⭐ {reward.cost_points} XP</p>
                  </div>
                  <button
                    disabled={!canAfford || isRedeemed || isRedeeming}
                    onClick={() => handleRedeem(reward.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isRedeemed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : canAfford
                        ? 'bg-violet-600 text-white hover:bg-violet-500'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {isRedeemed ? '✓ Sent!' : isRedeeming ? '...' : 'Redeem'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-white/20 text-xs text-center leading-relaxed pb-4">
          Rewards require parent approval. Your parent will see your request in their dashboard.
        </p>
      </div>
    </div>
  )
}
