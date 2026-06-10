import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { childId, rewardId } = body

  if (!childId || !rewardId) {
    return NextResponse.json({ error: 'childId and rewardId are required' }, { status: 400 })
  }

  // In production: verify child has enough XP, create redemption record, notify parent
  return NextResponse.json({
    success: true,
    status: 'requested',
    message: 'Reward request sent to your parent! 🎉',
  })
}
