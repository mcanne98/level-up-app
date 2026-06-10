import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { childId, quizId, selectedOptionId, lessonId } = body

  if (!childId || !quizId || !selectedOptionId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // In production: query DB for correct option, calculate score, update progress
  // For MVP demo: return mock result
  const correct = Math.random() > 0.3 // Demo: 70% chance correct
  const score = correct ? 100 : 50
  const xp = correct ? 25 : 10

  return NextResponse.json({
    correct,
    score,
    xp_awarded: xp,
    explanation: correct
      ? 'Great job! That is correct.'
      : 'Not quite — review the lesson and try again!',
  })
}
