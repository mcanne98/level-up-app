import { NextRequest, NextResponse } from 'next/server'

// Alice — Clear, Engaging Educator (British, female, educational use case)
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'
const MODEL_ID = 'eleven_turbo_v2_5' // fastest + cheapest

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'TTS not configured' }, { status: 503 })
  }

  const { text } = await req.json().catch(() => ({}))
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'text required' }, { status: 400 })
  }

  const trimmed = text.slice(0, 2500) // stay well within free tier per request

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: trimmed,
      model_id: MODEL_ID,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('ElevenLabs error:', err)
    return NextResponse.json({ error: 'TTS generation failed' }, { status: 502 })
  }

  const audio = await res.arrayBuffer()
  return new NextResponse(audio, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=86400', // cache 24h — same script = same audio
    },
  })
}
