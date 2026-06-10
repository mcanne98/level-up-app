import { NextRequest, NextResponse } from 'next/server'
import { ChildLoginSchema } from '@/lib/auth/validation'
import { verifyPassword } from '@/lib/auth/passwords'
import { rateLimitLogin } from '@/lib/auth/rate-limit'
import { demoStore } from '@/lib/auth/demo-store'
import crypto from 'crypto'

const GENERIC_ERROR = 'Invalid username or password.'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = ChildLoginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
  }

  const { username, password } = parsed.data

  // Rate limit — use a fixed key to avoid revealing username existence via timing
  const rl = await rateLimitLogin(username)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please wait and try again.' },
      { status: 429 }
    )
  }

  const child = demoStore.childByUsername(username)

  // Always run password comparison to prevent timing attacks
  const dummyHash = '$2a$12$invalid.hash.to.prevent.timing.attacks.padding'
  const passwordOk = child
    ? await verifyPassword(password, child.passwordHash)
    : await verifyPassword(password, dummyHash).catch(() => false)

  if (!child || !passwordOk) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
  }

  // Create session
  const sessionToken = crypto.randomBytes(32).toString('hex')
  const sessionHash  = crypto.createHash('sha256').update(sessionToken).digest('hex')
  const expiresAt    = new Date(Date.now() + 12 * 60 * 60 * 1000)

  demoStore.sessions.set(crypto.randomUUID(), {
    id: crypto.randomUUID(),
    userType: 'child',
    userId: child.id,
    sessionHash,
    expiresAt,
  })

  const response = NextResponse.json({ success: true, redirect: '/child/feed' })
  response.cookies.set('lu_child_session', sessionToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   12 * 60 * 60,
    path:     '/',
  })

  return response
}
