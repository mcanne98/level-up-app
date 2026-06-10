import { NextRequest, NextResponse } from 'next/server'
import { demoStore } from '@/lib/auth/demo-store'
import { AVATAR_EMOJIS } from '@/lib/auth/usernames'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  // Try parent session
  const parentToken = req.cookies.get('lu_parent_session')?.value
  if (parentToken) {
    const hash = crypto.createHash('sha256').update(parentToken).digest('hex')
    const session = demoStore.sessionByHash(hash)
    if (session && session.userType === 'parent' && !session.revokedAt && new Date(session.expiresAt) > new Date()) {
      const user = demoStore.users.get(session.userId)
      if (user) {
        const children = demoStore.childrenByParent(user.id).map(c => ({
          id: c.id,
          firstName: c.firstName,
          username: c.username,
          avatarAnimal: c.avatarAnimal,
          avatarEmoji: AVATAR_EMOJIS[c.avatarAnimal],
          grade: c.grade,
        }))
        return NextResponse.json({
          type: 'parent',
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          role: user.role,
          children,
        })
      }
    }
  }

  // Try child session
  const childToken = req.cookies.get('lu_child_session')?.value
  if (childToken) {
    const hash = crypto.createHash('sha256').update(childToken).digest('hex')
    const session = demoStore.sessionByHash(hash)
    if (session && session.userType === 'child' && !session.revokedAt && new Date(session.expiresAt) > new Date()) {
      const child = demoStore.children.get(session.userId)
      if (child) {
        return NextResponse.json({
          type: 'child',
          id: child.id,
          username: child.username,
          displayName: child.firstName,
          avatarAnimal: child.avatarAnimal,
          avatarEmoji: AVATAR_EMOJIS[child.avatarAnimal],
          grade: child.grade,
          currentXp: child.currentXp,
          currentLevel: child.currentLevel,
        })
      }
    }
  }

  return NextResponse.json({ type: 'unauthenticated' }, { status: 401 })
}
