'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AnimationScene, LessonAnimation } from '@/types'

interface Props {
  animation: LessonAnimation
  onComplete?: () => void
  autoPlay?: boolean
}

export function AnimatedLessonPlayer({ animation, onComplete, autoPlay = true }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [fadeIn, setFadeIn] = useState(true)

  const currentScene = animation.scenes[currentIndex]
  const progress = ((currentIndex + 1) / animation.scenes.length) * 100

  const goNext = useCallback(() => {
    if (currentIndex < animation.scenes.length - 1) {
      setFadeIn(false)
      setTimeout(() => {
        setCurrentIndex(i => i + 1)
        setFadeIn(true)
      }, 200)
    } else {
      onComplete?.()
    }
  }, [currentIndex, animation.scenes.length, onComplete])

  const goPrev = () => {
    if (currentIndex > 0) {
      setFadeIn(false)
      setTimeout(() => {
        setCurrentIndex(i => i - 1)
        setFadeIn(true)
      }, 200)
    }
  }

  useEffect(() => {
    if (!isPlaying) return
    const timer = setTimeout(goNext, currentScene?.duration_ms || 4000)
    return () => clearTimeout(timer)
  }, [currentIndex, isPlaying, currentScene, goNext])

  if (!currentScene) return null

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ backgroundColor: currentScene.bg_color }}
      onClick={() => isPlaying ? setIsPlaying(false) : setIsPlaying(true)}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20">
        <div
          className="h-full bg-white/70 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scene dots */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 px-4">
        {animation.scenes.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-6 bg-white' : i < currentIndex ? 'w-2 bg-white/50' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Scene content */}
      <div
        className={`flex flex-col items-center justify-center px-8 text-center transition-opacity duration-200 ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {currentScene.emoji && (
          <div className="text-7xl mb-6 animate-bounce-slow">{currentScene.emoji}</div>
        )}

        {currentScene.type === 'title' && (
          <h1
            className="text-3xl font-black leading-tight mb-4"
            style={{ color: currentScene.text_color }}
          >
            {currentScene.text}
          </h1>
        )}

        {(currentScene.type === 'fact' || currentScene.type === 'answer') && (
          <p
            className="text-2xl font-bold leading-snug mb-4"
            style={{ color: currentScene.text_color }}
          >
            {currentScene.text}
          </p>
        )}

        {currentScene.type === 'question' && (
          <div className="bg-white/20 rounded-3xl p-6 border-2 border-white/40">
            <p className="text-xl font-bold mb-2" style={{ color: currentScene.text_color }}>
              Quick Check ✋
            </p>
            <p className="text-lg" style={{ color: currentScene.text_color }}>
              {currentScene.text}
            </p>
          </div>
        )}

        {currentScene.type === 'celebration' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-8xl">🎉</div>
            <h2
              className="text-3xl font-black leading-tight"
              style={{ color: currentScene.text_color }}
            >
              {currentScene.text}
            </h2>
          </div>
        )}
      </div>

      {/* Tap hint */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 px-8">
        <button
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          onClick={e => { e.stopPropagation(); goPrev() }}
          aria-label="Previous"
        >
          ◀
        </button>
        <button
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          onClick={e => { e.stopPropagation(); setIsPlaying(p => !p) }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          onClick={e => { e.stopPropagation(); goNext() }}
          aria-label="Next"
        >
          ▶▶
        </button>
      </div>

      {/* Pause indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/30 rounded-full p-4">
            <span className="text-4xl">⏸</span>
          </div>
        </div>
      )}
    </div>
  )
}
