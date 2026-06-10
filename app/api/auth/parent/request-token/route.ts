import { NextRequest, NextResponse } from 'next/server'
import { RequestTokenSchema } from '@/lib/auth/validation'
import { generateToken, hashToken, tokenExpiresAt } from '@/lib/auth/tokens'
import { sendVerificationEmail } from '@/lib/auth/email'
import { rateLimitTokenRequest } from '@/lib/auth/rate-limit'
import { demoStore } from '@/lib/auth/demo-store'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = RequestTokenSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const { email } = parsed.data

  const rl = await rateLimitTokenRequest(email)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before requesting another code.' },
      { status: 429 }
    )
  }

  const user = demoStore.userByEmail(email)
  // Silently succeed if email not found — don't reveal whether account exists
  if (!user) {
    return NextResponse.json({ success: true })
  }

  const token = generateToken()
  const tokenHash = hashToken(token)

  demoStore.tokens.set(crypto.randomUUID(), {
    id: crypto.randomUUID(),
    userId: user.id,
    email,
    tokenHash,
    tokenType: 'parent_login',
    expiresAt: tokenExpiresAt(),
  })

  await sendVerificationEmail({ toEmail: email, firstName: user.firstName, token })

  const devHint = process.env.NODE_ENV !== 'production' ? { devToken: token } : {}
  return NextResponse.json({ success: true, ...devHint })
}
