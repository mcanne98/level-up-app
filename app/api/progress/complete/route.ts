import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { childId, lessonId, score, mode } = body

  if (!childId || !lessonId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const xpByMode: Record<string, number> = {
    curiosity: 50,
    school: 100,
    mission_intro: 150,
  }
  const xpAwarded = xpByMode[mode] || 50

  // In production: update child_lesson_progress, award XP, check for badges
  // Also: update child_learning_chain_progress if applicable

  return NextResponse.json({
    success: true,
    xp_awarded: xpAwarded,
    lesson_id: lessonId,
    new_total_xp: 350 + xpAwarded, // Demo placeholder
    badges_earned: [],
    chain_step_completed: mode,
  })
}
