export const AVATAR_ANIMALS = [
  'lion', 'tiger', 'bear', 'fox', 'wolf',
  'eagle', 'dolphin', 'panda', 'owl', 'turtle', 'dragon',
] as const

export type AvatarAnimal = (typeof AVATAR_ANIMALS)[number]

export const AVATAR_EMOJIS: Record<AvatarAnimal, string> = {
  lion:    '🦁',
  tiger:   '🐯',
  bear:    '🐻',
  fox:     '🦊',
  wolf:    '🐺',
  eagle:   '🦅',
  dolphin: '🐬',
  panda:   '🐼',
  owl:     '🦉',
  turtle:  '🐢',
  dragon:  '🐉',
}

/** Convert a first name to a URL-safe slug */
function nameSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9]/g, '')       // keep only alphanumeric
    .slice(0, 12)
}

/** Generate a candidate username — does NOT check uniqueness */
export function generateUsernameCandidate(animal: AvatarAnimal, firstName: string): string {
  const slug = nameSlug(firstName)
  const num  = Math.floor(1000 + Math.random() * 9000) // 4-digit
  return `${animal}-${slug}-${num}`
}

/**
 * Generate a globally unique username.
 * checkExists(username) should return true if the username is already taken.
 * Retries up to maxAttempts times.
 */
export async function generateUniqueUsername(
  animal: AvatarAnimal,
  firstName: string,
  checkExists: (username: string) => Promise<boolean>,
  maxAttempts = 10
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = generateUsernameCandidate(animal, firstName)
    const taken = await checkExists(candidate)
    if (!taken) return candidate
  }
  throw new Error('Could not generate a unique username after multiple attempts')
}
