import { NextRequest, NextResponse } from 'next/server'
import { getVideoGenerator } from '@/lib/video/fallback-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params
  const generator = getVideoGenerator()
  const status = await generator.getStatus(jobId)
  return NextResponse.json(status)
}
