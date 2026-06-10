import { NextRequest, NextResponse } from 'next/server'
import { getVideoGenerator } from '@/lib/video/fallback-generator'
import type { VideoGenerationInput } from '@/types'

export async function POST(request: NextRequest) {
  const body = await request.json() as VideoGenerationInput

  if (!body.lessonId || !body.title) {
    return NextResponse.json({ error: 'lessonId and title are required' }, { status: 400 })
  }

  const generator = getVideoGenerator()
  const result = await generator.generateVideo(body)

  return NextResponse.json({ job: result })
}
