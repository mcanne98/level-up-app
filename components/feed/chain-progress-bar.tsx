'use client'

import type { ChainProgress } from '@/types'

interface Props {
  progress: Partial<ChainProgress>
  chainTitle?: string
}

export function ChainProgressBar({ progress, chainTitle }: Props) {
  const steps = [
    { key: 'curiosity_completed', label: 'Curiosity', emoji: '✨', done: progress.curiosity_completed },
    { key: 'school_completed', label: 'School', emoji: '📚', done: progress.school_completed },
    { key: 'mission_completed', label: 'Mission', emoji: '🎯', done: progress.mission_completed },
    { key: 'reward_unlocked', label: 'Reward', emoji: '🏆', done: progress.reward_unlocked },
  ]

  const completedCount = steps.filter(s => s.done).length

  return (
    <div className="w-full px-4 py-3">
      {chainTitle && (
        <p className="text-white/60 text-xs text-center mb-2">{chainTitle}</p>
      )}
      <div className="flex items-center gap-1">
        {steps.map((step, i) => (
          <div key={step.key} className="flex items-center flex-1">
            <div
              className={`flex flex-col items-center gap-1 flex-1 transition-all duration-300 ${
                step.done ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${
                  step.done
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/30 scale-110'
                    : 'bg-white/10 border border-white/20'
                }`}
              >
                {step.done ? '✅' : step.emoji}
              </div>
              <span className="text-white/70 text-[10px] font-medium">{step.label}</span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-4 transition-all duration-300 ${
                  steps[i + 1].done ? 'bg-orange-500' : 'bg-white/20'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
