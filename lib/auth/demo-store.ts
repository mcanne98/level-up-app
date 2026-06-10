/**
 * In-memory store used when Supabase is not configured.
 * Gives a fully working auth experience in demo / local mode.
 * Data is ephemeral — resets on server restart.
 */

import type { AvatarAnimal } from './usernames'

export interface DemoUser {
  id: string
  email: string
  firstName: string
  lastName: string
  emailVerified: boolean
  role: 'parent' | 'admin'
  createdAt: Date
}

export interface DemoToken {
  id: string
  userId: string
  email: string
  tokenHash: string
  tokenType: 'parent_verification' | 'parent_login'
  expiresAt: Date
  usedAt?: Date
}

export interface DemoChild {
  id: string
  parentId: string
  firstName: string
  displayName: string
  username: string
  passwordHash: string
  avatarAnimal: AvatarAnimal
  age: number
  grade: number
  currentXp: number
  currentLevel: number
}

export interface DemoSession {
  id: string
  userType: 'parent' | 'child'
  userId: string
  sessionHash: string
  expiresAt: Date
  revokedAt?: Date
}

class DemoStore {
  users    = new Map<string, DemoUser>()
  tokens   = new Map<string, DemoToken>()
  children = new Map<string, DemoChild>()
  sessions = new Map<string, DemoSession>()

  userByEmail(email: string): DemoUser | undefined {
    return [...this.users.values()].find(u => u.email.toLowerCase() === email.toLowerCase())
  }

  childByUsername(username: string): DemoChild | undefined {
    return [...this.children.values()].find(c => c.username === username.toLowerCase())
  }

  childrenByParent(parentId: string): DemoChild[] {
    return [...this.children.values()].filter(c => c.parentId === parentId)
  }

  sessionByHash(hash: string): DemoSession | undefined {
    return [...this.sessions.values()].find(s => s.sessionHash === hash)
  }

  usernameExists(username: string): boolean {
    return [...this.children.values()].some(c => c.username === username)
  }
}

// Module-level singleton — persists across requests in the same process
const globalStore = global as typeof global & { __demoStore?: DemoStore }
if (!globalStore.__demoStore) globalStore.__demoStore = new DemoStore()
export const demoStore = globalStore.__demoStore
