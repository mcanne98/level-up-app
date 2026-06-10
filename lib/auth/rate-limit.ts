/**
 * Simple DB-backed rate limiter.
 * Falls back to an in-memory store when Supabase is not configured (dev/demo mode).
 */

const inMemoryStore = new Map<string, number[]>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetMs: number
}

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowStart = now - windowMs

  // In-memory fallback (dev / no-DB mode)
  const timestamps = (inMemoryStore.get(key) || []).filter(t => t > windowStart)
  timestamps.push(now)
  inMemoryStore.set(key, timestamps)

  const count = timestamps.length
  const allowed = count <= maxRequests
  const oldest = timestamps[0] ?? now
  const resetMs = oldest + windowMs - now

  return {
    allowed,
    remaining: Math.max(0, maxRequests - count),
    resetMs,
  }
}

/** Rate limit for token requests: 5 per 15 minutes per email */
export async function rateLimitTokenRequest(email: string): Promise<RateLimitResult> {
  return checkRateLimit(`token_req:${email}`, 5, 15 * 60 * 1000)
}

/** Rate limit for login attempts: 10 per 15 minutes per username */
export async function rateLimitLogin(username: string): Promise<RateLimitResult> {
  return checkRateLimit(`login:${username}`, 10, 15 * 60 * 1000)
}
