import { NextRequest, NextResponse } from 'next/server'
import { DEMO_CHAINS, DEMO_CHILD } from '@/lib/demo-data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const childId = searchParams.get('childId') || DEMO_CHILD.id

  // In production: query Supabase for child profile, interests, chain progress, weak areas
  // Then run rankChains() from lib/recommendation/engine.ts
  // For MVP demo: return sorted demo chains

  const recommendations = DEMO_CHAINS.map((chain, i) => ({
    chain,
    score: 95 - i * 10,
    reasons: i === 0
      ? ['Matches your interests', 'Perfect for Grade 6', 'Something new to explore']
      : i === 1
      ? ['Matches your interests', 'Continue where you left off']
      : ['Helps strengthen a weak area'],
    next_step: 'curiosity' as const,
    progress: undefined,
  }))

  return NextResponse.json({ recommendations, child_id: childId })
}
