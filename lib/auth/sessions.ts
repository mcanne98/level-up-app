import crypto from 'crypto'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export const PARENT_COOKIE = 'lu_parent_session'
export const CHILD_COOKIE  = 'lu_child_session'

const PARENT_SESSION_DAYS = 7
const CHILD_SESSION_HOURS = 12

export type SessionUser =
  | { type: 'parent'; id: string; email: string; firstName: string; role: string }
  | { type: 'child';  id: string; username: string; displayName: string; grade: number }
  | null

/** Generate a cryptographically random session token */
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// ── Create sessions ────────────────────────────────────────────────────────

export async function createParentSession(userId: string): Promise<string> {
  const token = generateSessionToken()
  const hash  = hashSessionToken(token)
  const expiresAt = new Date(Date.now() + PARENT_SESSION_DAYS * 24 * 60 * 60 * 1000)

  const db = await createClient()
  await db.from('sessions').insert({
    user_type:    'parent',
    user_id:      userId,
    session_hash: hash,
    expires_at:   expiresAt.toISOString(),
  })

  return token
}

export async function createChildSession(childId: string): Promise<string> {
  const token = generateSessionToken()
  const hash  = hashSessionToken(token)
  const expiresAt = new Date(Date.now() + CHILD_SESSION_HOURS * 60 * 60 * 1000)

  const db = await createClient()
  await db.from('sessions').insert({
    user_type:    'child',
    user_id:      childId,
    session_hash: hash,
    expires_at:   expiresAt.toISOString(),
  })

  return token
}

// ── Set / clear cookies ────────────────────────────────────────────────────

export async function setParentCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(PARENT_COOKIE, token, {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === 'production',
    sameSite:  'lax',
    maxAge:    PARENT_SESSION_DAYS * 24 * 60 * 60,
    path:      '/',
  })
}

export async function setChildCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(CHILD_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   CHILD_SESSION_HOURS * 60 * 60,
    path:     '/',
  })
}

export async function clearSessionCookies() {
  const cookieStore = await cookies()
  cookieStore.delete(PARENT_COOKIE)
  cookieStore.delete(CHILD_COOKIE)
}

// ── Resolve session from request cookies ──────────────────────────────────

export async function getSession(): Promise<SessionUser> {
  const cookieStore = await cookies()
  const parentToken = cookieStore.get(PARENT_COOKIE)?.value
  const childToken  = cookieStore.get(CHILD_COOKIE)?.value

  const db = await createClient()

  if (parentToken) {
    const hash = hashSessionToken(parentToken)
    const { data: session } = await db
      .from('sessions')
      .select('user_id, expires_at, revoked_at')
      .eq('session_hash', hash)
      .eq('user_type', 'parent')
      .single()

    if (session && !session.revoked_at && new Date(session.expires_at) > new Date()) {
      const { data: user } = await db
        .from('users')
        .select('id, email, first_name, role')
        .eq('id', session.user_id)
        .single()

      if (user) {
        return { type: 'parent', id: user.id, email: user.email, firstName: user.first_name, role: user.role }
      }
    }
  }

  if (childToken) {
    const hash = hashSessionToken(childToken)
    const { data: session } = await db
      .from('sessions')
      .select('user_id, expires_at, revoked_at')
      .eq('session_hash', hash)
      .eq('user_type', 'child')
      .single()

    if (session && !session.revoked_at && new Date(session.expires_at) > new Date()) {
      const { data: child } = await db
        .from('child_profiles')
        .select('id, username, display_name, grade')
        .eq('id', session.user_id)
        .single()

      if (child) {
        return { type: 'child', id: child.id, username: child.username, displayName: child.display_name, grade: child.grade }
      }
    }
  }

  return null
}

export async function revokeSession(token: string, type: 'parent' | 'child') {
  const hash = hashSessionToken(token)
  const db = await createClient()
  await db
    .from('sessions')
    .update({ revoked_at: new Date().toISOString() })
    .eq('session_hash', hash)
    .eq('user_type', type)
}
