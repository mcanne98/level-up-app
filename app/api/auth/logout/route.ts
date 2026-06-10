import { NextRequest, NextResponse } from 'next/server'
import { demoStore } from '@/lib/auth/demo-store'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true })

  for (const cookieName of ['lu_parent_session', 'lu_child_session']) {
    const token = req.cookies.get(cookieName)?.value
    if (token) {
      const hash = crypto.createHash('sha256').update(token).digest('hex')
      const session = demoStore.sessionByHash(hash)
      if (session) session.revokedAt = new Date()
    }
    response.cookies.set(cookieName, '', { maxAge: 0, path: '/' })
  }

  return response
}
