import { NextRequest, NextResponse } from 'next/server'
import { VerifyTokenSchema } from '@/lib/auth/validation'
import { hashToken, verifyTokenHash } from '@/lib/auth/tokens'
import { demoStore } from '@/lib/auth/demo-store'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = VerifyTokenSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation error" }, { status: 400 })
  }

  const { email, token } = parsed.data

  // Find a valid, unused, unexpired token for this email
  const allTokens = [...demoStore.tokens.values()]
  const match = allTokens.find(
    t =>
      t.email.toLowerCase() === email.toLowerCase() &&
      !t.usedAt &&
      new Date(t.expiresAt) > new Date() &&
      verifyTokenHash(token, t.tokenHash)
  )

  if (!match) {
    return NextResponse.json(
      { error: 'Invalid or expired code. Please try again.' },
      { status: 401 }
    )
  }

  // Mark token used
  match.usedAt = new Date()

  // Mark user verified
  const user = demoStore.users.get(match.userId)
  if (!user) {
    return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
  }
  user.emailVerified = true

  // Create session
  const sessionToken = crypto.randomBytes(32).toString('hex')
  const sessionHash  = crypto.createHash('sha256').update(sessionToken).digest('hex')
  const expiresAt    = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  demoStore.sessions.set(crypto.randomUUID(), {
    id: crypto.randomUUID(),
    userType: 'parent',
    userId: user.id,
    sessionHash,
    expiresAt,
  })

  const response = NextResponse.json({
    success: true,
    redirect: '/parent/children/new',
  })

  response.cookies.set('lu_parent_session', sessionToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   7 * 24 * 60 * 60,
    path:     '/',
  })

  return response
}
