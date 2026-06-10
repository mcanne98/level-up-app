import { NextRequest, NextResponse } from 'next/server'
import { ParentSignupSchema } from '@/lib/auth/validation'
import { generateToken, hashToken, tokenExpiresAt } from '@/lib/auth/tokens'
import { sendVerificationEmail } from '@/lib/auth/email'
import { rateLimitTokenRequest } from '@/lib/auth/rate-limit'
import { demoStore } from '@/lib/auth/demo-store'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = ParentSignupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation error" }, { status: 400 })
  }

  const { firstName, lastName, email } = parsed.data

  // Rate limit
  const rl = await rateLimitTokenRequest(email)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before requesting another code.' },
      { status: 429 }
    )
  }

  const token = generateToken()
  const tokenHash = hashToken(token)
  const expiresAt = tokenExpiresAt()

  // Demo/in-memory mode
  let user = demoStore.userByEmail(email)
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
      emailVerified: false,
      role: 'parent',
      createdAt: new Date(),
    }
    demoStore.users.set(user.id, user)
  } else {
    // Update name if returning
    user.firstName = firstName
    user.lastName  = lastName
  }

  demoStore.tokens.set(crypto.randomUUID(), {
    id: crypto.randomUUID(),
    userId: user.id,
    email,
    tokenHash,
    tokenType: 'parent_verification',
    expiresAt,
  })

  await sendVerificationEmail({ toEmail: email, firstName, token })

  // In dev: surface token in response so UI can pre-fill it
  const devHint = process.env.NODE_ENV !== 'production' ? { devToken: token } : {}

  return NextResponse.json({ success: true, email, ...devHint })
}
