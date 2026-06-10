import crypto from 'crypto'

/** Generate a 6-digit numeric token */
export function generateToken(): string {
  // Cryptographically random 6-digit code
  const buf = crypto.randomBytes(4)
  const num = buf.readUInt32BE(0) % 1_000_000
  return num.toString().padStart(6, '0')
}

/** SHA-256 hash of a token — safe to store in DB */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/** Compare a plain token against a stored hash */
export function verifyTokenHash(token: string, hash: string): boolean {
  const computed = hashToken(token)
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash))
}

export const TOKEN_TTL_MS = 15 * 60 * 1000 // 15 minutes

export function tokenExpiresAt(): Date {
  return new Date(Date.now() + TOKEN_TTL_MS)
}
