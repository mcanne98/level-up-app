import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { childId, missionId, proofType, proofData } = body

  if (!childId || !missionId) {
    return NextResponse.json({ error: 'childId and missionId are required' }, { status: 400 })
  }

  // In production: update child_missions record, notify parent if needed
  // Award XP only after parent approval (for parent_confirmed missions)
  const requiresApproval = proofType === 'parent_confirmed'

  return NextResponse.json({
    success: true,
    status: requiresApproval ? 'submitted' : 'completed',
    xp_pending: requiresApproval,
    message: requiresApproval
      ? 'Mission submitted! Your parent needs to confirm it to unlock your XP.'
      : 'Mission complete! XP awarded!',
  })
}
