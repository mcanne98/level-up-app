/**
 * PBKDF2 password hashing using the Web Crypto API.
 * Works in all environments: Node.js, Cloudflare Workers, browser.
 * Format: pbkdf2$<iterations>$<salt_hex>$<hash_hex>
 */

const ITERATIONS  = 100_000 // Cloudflare Workers max for PBKDF2-SHA256
const HASH_LENGTH = 32      // 256-bit output

function getCrypto(): typeof crypto {
  // Works in Node 18+, Cloudflare Workers, and browsers
  return globalThis.crypto
}

export async function hashPassword(password: string): Promise<string> {
  const subtle = getCrypto().subtle
  const salt   = getCrypto().getRandomValues(new Uint8Array(16))

  const keyMaterial = await subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  )
  const bits = await subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    HASH_LENGTH * 8
  )

  const saltHex = Buffer.from(salt).toString('hex')
  const hashHex = Buffer.from(bits).toString('hex')
  return `pbkdf2$${ITERATIONS}$${saltHex}$${hashHex}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  // Handle dummy/invalid stored hashes without throwing
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false

  const [, iterStr, saltHex, expectedHex] = parts
  const iterations = parseInt(iterStr, 10)
  const salt       = Buffer.from(saltHex, 'hex')

  const subtle      = getCrypto().subtle
  const keyMaterial = await subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  )
  const bits = await subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    HASH_LENGTH * 8
  )

  const computedHex = Buffer.from(bits).toString('hex')

  // Timing-safe compare
  if (computedHex.length !== expectedHex.length) return false
  let diff = 0
  for (let i = 0; i < computedHex.length; i++) {
    diff |= computedHex.charCodeAt(i) ^ expectedHex.charCodeAt(i)
  }
  return diff === 0
}

