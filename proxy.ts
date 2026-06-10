import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const PUBLIC_PATHS = ['/', '/signup', '/verify', '/parent-login', '/child-login', '/offline']
const API_PUBLIC   = ['/api/auth/']

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (API_PUBLIC.some(p => pathname.startsWith(p))) return true
  if (pathname.startsWith('/_next') || pathname.startsWith('/icons') || pathname === '/manifest.json' || pathname === '/sw.js') return true
  return false
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublic(pathname)) return NextResponse.next()

  const parentToken = req.cookies.get('lu_parent_session')?.value
  const childToken  = req.cookies.get('lu_child_session')?.value

  // Child routes — require child session
  if (pathname.startsWith('/child/')) {
    if (!childToken) {
      return NextResponse.redirect(new URL('/child-login', req.url))
    }
    return NextResponse.next()
  }

  // Parent routes — require parent session
  if (pathname.startsWith('/parent/') || pathname.startsWith('/admin/')) {
    if (!parentToken) {
      return NextResponse.redirect(new URL('/parent-login', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
