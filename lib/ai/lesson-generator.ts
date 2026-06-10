import type { LessonGenerationInput, GeneratedLesson, AnimationScene } from '@/types'

const SUBJECT_EMOJIS: Record<string, string> = {
  Math: '🔢',
  Science: '🔬',
  Language: '📝',
  History: '🏛️',
  Geography: '🌍',
  Arts: '🎨',
  Music: '🎵',
  'Physical Education': '⚽',
  Technology: '💻',
  Health: '❤️',
}

/**
 * Generates a lesson using the Anthropic API.
 * Falls back to a template-based generator if the API is not configured.
 */
export async function generateLesson(input: LessonGenerationInput): Promise<GeneratedLesson> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (apiKey) {
    return generateWithAI(input, apiKey)
  }

  return generateFromTemplate(input)
}

async function generateWithAI(
  input: LessonGenerationInput,
  apiKey: string
): Promise<GeneratedLesson> {
  const prompt = buildPrompt(input)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    console.error('AI generation failed, using template fallback')
    return generateFromTemplate(input)
  }

  const data = await response.json()
  const text = data.content[0].text

  try {
    const jsonMatch = text.match(/```json\n([\s\S]+?)\n```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1])
    }
    return JSON.parse(text)
  } catch {
    return generateFromTemplate(input)
  }
}

function buildPrompt(input: LessonGenerationInput): string {
  return `Create a ${input.duration_seconds}-second Grade ${input.grade} Ontario ${input.subject} lesson about "${input.concept_name}" using ${input.interest_anchor} as an analogy.

Curriculum expectation: ${input.expectation_text}
Difficulty: ${input.difficulty}/5
Mode: ${input.mode}

Return ONLY valid JSON in this exact format:
\`\`\`json
{
  "title": "...",
  "hook": "...",
  "script": "4 short sentences that explain the concept",
  "summary": "...",
  "thumbnail_emoji": "...",
  "interest_tags": ["tag1", "tag2"],
  "quiz": {
    "question": "...",
    "options": [
      {"text": "...", "correct": true},
      {"text": "...", "correct": false},
      {"text": "...", "correct": false},
      {"text": "...", "correct": false}
    ],
    "explanation": "..."
  },
  "mission": {
    "title": "...",
    "description": "Real-world mission task in 2 sentences",
    "proof_type": "self_report"
  },
  "storyboard": [
    {"id": "s1", "type": "title", "text": "...", "emoji": "...", "bg_color": "#1a1a2e", "text_color": "#ffffff", "duration_ms": 3000, "transition": "fade"},
    {"id": "s2", "type": "fact", "text": "...", "bg_color": "#16213e", "text_color": "#ffffff", "duration_ms": 4000, "transition": "slide"},
    {"id": "s3", "type": "fact", "text": "...", "bg_color": "#0f3460", "text_color": "#ffffff", "duration_ms": 4000, "transition": "slide"},
    {"id": "s4", "type": "celebration", "text": "...", "emoji": "⭐", "bg_color": "#f39c12", "text_color": "#ffffff", "duration_ms": 2500, "transition": "zoom"}
  ]
}
\`\`\``
}

function generateFromTemplate(input: LessonGenerationInput): GeneratedLesson {
  const emoji = SUBJECT_EMOJIS[input.subject] || '📚'
  const interestEmoji = getInterestEmoji(input.interest_anchor)

  const title = `${input.interest_anchor} Meets ${input.concept_name}`
  const hook = `Did you know ${input.interest_anchor} is powered by ${input.subject}? Let's find out how!`

  const script = [
    `${input.concept_name} is a key idea in ${input.subject}.`,
    `When you think about ${input.interest_anchor}, you see this concept in action.`,
    `For example, every time you see ${input.interest_anchor}, this principle applies.`,
    `Understanding this helps you master Grade ${input.grade} ${input.subject}.`,
  ].join('\n')

  return {
    title,
    hook,
    script,
    summary: `Learn about ${input.concept_name} through the lens of ${input.interest_anchor}.`,
    thumbnail_emoji: interestEmoji || emoji,
    interest_tags: [input.interest_anchor.toLowerCase(), input.subject.toLowerCase()],
    quiz: {
      question: `What is the main idea of ${input.concept_name}?`,
      options: [
        { text: `It describes a core principle in ${input.subject}`, correct: true },
        { text: 'It is only used in advanced courses', correct: false },
        { text: 'It has nothing to do with real life', correct: false },
        { text: 'It only applies to Grade 12', correct: false },
      ],
      explanation: `${input.concept_name} is fundamental to Grade ${input.grade} ${input.subject} and appears in everyday life.`,
    },
    mission: {
      title: `${input.concept_name} in Real Life`,
      description: `Find one example of ${input.concept_name} in your home or neighbourhood. Tell someone what you found and why it connects to what you learned.`,
      proof_type: 'self_report',
    },
    storyboard: buildDefaultStoryboard(title, hook, script, emoji),
  }
}

function buildDefaultStoryboard(
  title: string,
  hook: string,
  script: string,
  emoji: string
): AnimationScene[] {
  const lines = script.split('\n').filter(Boolean)
  return [
    {
      id: 's1',
      type: 'title',
      text: hook,
      emoji,
      bg_color: '#1a1a2e',
      text_color: '#ffffff',
      duration_ms: 3000,
      transition: 'fade',
    },
    ...lines.slice(0, 3).map((line, i) => ({
      id: `s${i + 2}`,
      type: 'fact' as const,
      text: line,
      bg_color: ['#16213e', '#0f3460', '#533483'][i],
      text_color: '#ffffff',
      duration_ms: 4000,
      transition: 'slide' as const,
    })),
    {
      id: 's5',
      type: 'celebration',
      text: `Amazing work! You just levelled up! 🚀`,
      emoji: '⭐',
      bg_color: '#f39c12',
      text_color: '#ffffff',
      duration_ms: 2500,
      transition: 'zoom',
    },
  ]
}

function getInterestEmoji(interest: string): string {
  const map: Record<string, string> = {
    space: '🚀',
    dinosaurs: '🦕',
    minecraft: '⛏️',
    karate: '🥋',
    soccer: '⚽',
    animals: '🐾',
    cooking: '🍳',
    gaming: '🎮',
    technology: '💻',
    science: '🔬',
    history: '🏛️',
    music: '🎵',
    art: '🎨',
    math: '🔢',
    reading: '📖',
    sports: '🏅',
  }
  return map[interest.toLowerCase()] || '✨'
}
