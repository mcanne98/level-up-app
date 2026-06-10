import { NextRequest, NextResponse } from 'next/server'
import { generateLesson } from '@/lib/ai/lesson-generator'
import type { LessonGenerationInput } from '@/types'

export async function POST(request: NextRequest) {
  const body = await request.json() as LessonGenerationInput

  const required = ['grade', 'subject', 'expectation_text', 'concept_name', 'interest_anchor']
  for (const field of required) {
    if (!body[field as keyof LessonGenerationInput]) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
    }
  }

  const input: LessonGenerationInput = {
    grade: body.grade,
    subject: body.subject,
    expectation_text: body.expectation_text,
    concept_name: body.concept_name,
    interest_anchor: body.interest_anchor,
    difficulty: body.difficulty || 2,
    duration_seconds: body.duration_seconds || 60,
    mode: body.mode || 'curiosity',
  }

  const lesson = await generateLesson(input)
  return NextResponse.json({ lesson })
}
