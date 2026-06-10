'use client'

/**
 * Client-side auth guards for route protection.
 * Used in layout files because Next.js 16 proxy.ts runs on Node.js only,
 * which is incompatible with Cloudflare Workers edge runtime.
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type SessionType = 'parent' | 'child' | 'unauthenticated' | 'loading'

export function useAuthGuard(required: 'parent' | 'child') {
  const router = useRouter()
  const [status, setStatus] = useState<SessionType>('loading')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        setStatus(data.type as SessionType)
        if (data.type === 'unauthenticated') {
          router.replace(required === 'child' ? '/child-login' : '/parent-login')
        } else if (required === 'child' && data.type !== 'child') {
          router.replace('/child-login')
        } else if (required === 'parent' && data.type !== 'parent') {
          router.replace('/parent-login')
        }
      })
      .catch(() => {
        setStatus('unauthenticated')
        router.replace(required === 'child' ? '/child-login' : '/parent-login')
      })
  }, [router, required])

  return status
}

export function ParentGuard({ children }: { children: React.ReactNode }) {
  const status = useAuthGuard('parent')
  if (status === 'loading') return <AuthLoading />
  if (status !== 'parent') return null
  return <>{children}</>
}

export function ChildGuard({ children }: { children: React.ReactNode }) {
  const status = useAuthGuard('child')
  if (status === 'loading') return <AuthLoading />
  if (status !== 'child') return null
  return <>{children}</>
}

function AuthLoading() {
  return (
    <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="text-5xl animate-pulse">🚀</div>
        <p className="text-white/40 text-sm">Loading…</p>
      </div>
    </div>
  )
}
