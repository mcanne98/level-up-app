'use client'

import { useEffect, useState } from 'react'

interface Props {
  amount: number
  message?: string
  onDone?: () => void
}

export function XPToast({ amount, message, onDone }: Props) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDone?.(), 300)
    }, 2000)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-2 px-6 py-3 rounded-full
        bg-gradient-to-r from-yellow-400 to-orange-500 shadow-2xl shadow-orange-500/50
        font-black text-white text-lg
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      <span>⭐</span>
      <span>+{amount} XP</span>
      {message && <span className="text-sm font-medium opacity-80">— {message}</span>}
    </div>
  )
}
