'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { LessonAnimation } from '@/types'

interface Props {
  animation: LessonAnimation
  narrationScript: string
  onComplete?: () => void
  autoPlay?: boolean
}

type AudioState = 'idle' | 'loading' | 'playing' | 'error'

export function NarratedPlayer({ animation, narrationScript, onComplete, autoPlay = true }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [fadeIn, setFadeIn] = useState(true)
  const [audioState, setAudioState] = useState<AudioState>('idle')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioBlobRef = useRef<string | null>(null)
  const hasCompletedRef = useRef(false)

  const scenes = animation.scenes
  const currentScene = scenes[currentIndex]
  const progress = ((currentIndex + 1) / scenes.length) * 100

  // Fetch narration audio once on mount
  useEffect(() => {
    if (!narrationScript) return
    setAudioState('loading')

    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: narrationScript }),
    })
      .then(r => {
        if (!r.ok) throw new Error('TTS failed')
        return r.blob()
      })
      .then(blob => {
        const url = URL.createObjectURL(blob)
        audioBlobRef.current = url
        const audio = new Audio(url)
        audio.preload = 'auto'
        audioRef.current = audio
        setAudioState('idle')
        if (autoPlay) {
          audio.play().catch(() => setAudioState('error'))
          setAudioState('playing')
        }
      })
      .catch(() => setAudioState('error'))

    return () => {
      audioRef.current?.pause()
      if (audioBlobRef.current) URL.revokeObjectURL(audioBlobRef.current)
    }
  }, [narrationScript, autoPlay])

  const goNext = useCallback(() => {
    if (currentIndex < scenes.length - 1) {
      setFadeIn(false)
      setTimeout(() => {
        setCurrentIndex(i => i + 1)
        setFadeIn(true)
      }, 200)
    } else if (!hasCompletedRef.current) {
      hasCompletedRef.current = true
      onComplete?.()
    }
  }, [currentIndex, scenes.length, onComplete])

  // Auto-advance slides on timer (audio plays independently)
  useEffect(() => {
    if (!isPlaying) return
    const ms = currentScene?.duration_ms || 4000
    const timer = setTimeout(goNext, ms)
    return () => clearTimeout(timer)
  }, [currentIndex, isPlaying, currentScene, goNext])

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {})
      }
    }
    setIsPlaying(p => !p)
  }

  if (!currentScene) return null

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ backgroundColor: currentScene.bg_color }}
      onClick={togglePlayback}
    >
      {/* Story progress bars (TikTok-style) */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 px-3 pt-3 z-10">
        {scenes.map((s, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                i < currentIndex ? 'bg-white w-full' :
                i === currentIndex && isPlaying ? 'bg-white animate-grow-x' : 'bg-white/0 w-0'
              }`}
              style={i === currentIndex && isPlaying
                ? { animationDuration: `${s.duration_ms}ms`, animationTimingFunction: 'linear', animationFillMode: 'forwards' }
                : undefined
              }
            />
          </div>
        ))}
      </div>

      {/* Audio status pill */}
      <div className="absolute top-10 right-3 z-10">
        {audioState === 'loading' && (
          <span className="text-xs bg-black/40 text-white/70 rounded-full px-2 py-0.5">🎙 Loading…</span>
        )}
        {audioState === 'error' && (
          <span className="text-xs bg-black/40 text-white/50 rounded-full px-2 py-0.5">🔇 No audio</span>
        )}
        {audioState === 'playing' && !isPlaying && (
          <span className="text-xs bg-black/40 text-white/70 rounded-full px-2 py-0.5">⏸ Paused</span>
        )}
      </div>

      {/* Scene content */}
      <div
        className={`flex flex-col items-center justify-center px-8 text-center transition-opacity duration-200 ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {currentScene.emoji && (
          <div className="text-8xl mb-6 drop-shadow-lg">{currentScene.emoji}</div>
        )}

        {currentScene.type === 'title' && (
          <h1 className="text-3xl font-black leading-tight mb-4 drop-shadow-md" style={{ color: currentScene.text_color }}>
            {currentScene.text}
          </h1>
        )}

        {(currentScene.type === 'fact' || currentScene.type === 'answer') && (
          <p className="text-2xl font-bold leading-snug mb-4 drop-shadow-sm" style={{ color: currentScene.text_color }}>
            {currentScene.text}
          </p>
        )}

        {currentScene.type === 'question' && (
          <div className="bg-white/20 rounded-3xl p-6 border-2 border-white/40 backdrop-blur-sm">
            <p className="text-xl font-bold mb-2" style={{ color: currentScene.text_color }}>Quick Check ✋</p>
            <p className="text-lg" style={{ color: currentScene.text_color }}>{currentScene.text}</p>
          </div>
        )}

        {currentScene.type === 'celebration' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-8xl animate-bounce">🎉</div>
            <h2 className="text-3xl font-black leading-tight" style={{ color: currentScene.text_color }}>
              {currentScene.text}
            </h2>
          </div>
        )}
      </div>

      {/* Bottom nav (tap zones) */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div className="w-1/3 h-full pointer-events-auto" onClick={e => { e.stopPropagation(); if (currentIndex > 0) { setFadeIn(false); setTimeout(() => { setCurrentIndex(i => i - 1); setFadeIn(true) }, 200) } }} />
        <div className="w-1/3 h-full pointer-events-auto" onClick={e => { e.stopPropagation(); togglePlayback() }} />
        <div className="w-1/3 h-full pointer-events-auto" onClick={e => { e.stopPropagation(); goNext() }} />
      </div>

      {/* Pause overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/30 rounded-full p-5 backdrop-blur-sm">
            <span className="text-5xl">⏸</span>
          </div>
        </div>
      )}
    </div>
  )
}
