import { NextRequest, NextResponse } from 'next/server'
import { GenerateUsernameSchema } from '@/lib/auth/validation'
import { generateUniqueUsername } from '@/lib/auth/usernames'
import { demoStore } from '@/lib/auth/demo-store'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = GenerateUsernameSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation error" }, { status: 400 })
  }

  const { firstName, avatarAnimal } = parsed.data

  const username = await generateUniqueUsername(
    avatarAnimal,
    firstName,
    async (u) => demoStore.usernameExists(u)
  )

  return NextResponse.json({ username })
}
