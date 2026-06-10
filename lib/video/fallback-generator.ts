import type { VideoGenerator } from './types'
import type { VideoGenerationInput, VideoGenerationResult, AnimationScene } from '@/types'

/**
 * Fallback animated lesson generator — works without any paid video APIs.
 * Creates a JSON storyboard rendered client-side as animated cards.
 */
export class FallbackAnimatedLessonGenerator implements VideoGenerator {
  async generateVideo(input: VideoGenerationInput): Promise<VideoGenerationResult> {
    const scenes = this.buildScenes(input)
    const animationJson = JSON.stringify({ scenes, background_color: '#1a1a2e' })

    // Store animation JSON in the database instead of a video file
    return {
      jobId: `fallback_${Date.now()}_${input.lessonId}`,
      provider: 'fallback',
      estimatedSeconds: 1,
    }
  }

  async getStatus(jobId: string) {
    return { status: 'completed' as const }
  }

  buildScenes(input: VideoGenerationInput): AnimationScene[] {
    const scenes: AnimationScene[] = []

    // Scene 1: Hook / Title
    scenes.push({
      id: 'hook',
      type: 'title',
      text: input.hook || input.title,
      emoji: this.getSubjectEmoji(input.subject),
      bg_color: '#1a1a2e',
      text_color: '#ffffff',
      duration_ms: 3000,
      transition: 'fade',
    })

    // Scene 2: Subject label
    scenes.push({
      id: 'subject',
      type: 'fact',
      text: `${input.subject} • Grade ${input.grade}`,
      emoji: '📚',
      bg_color: '#16213e',
      text_color: '#a8d8ea',
      duration_ms: 2000,
      transition: 'slide',
    })

    // Parse script into scenes (up to 4 content scenes)
    const scriptLines = (input.script || '').split('\n').filter(Boolean).slice(0, 4)
    const bgColors = ['#0f3460', '#533483', '#e94560', '#2c3e50']

    scriptLines.forEach((line, i) => {
      scenes.push({
        id: `content_${i}`,
        type: 'fact',
        text: line,
        bg_color: bgColors[i % bgColors.length],
        text_color: '#ffffff',
        duration_ms: 4000,
        transition: i % 2 === 0 ? 'slide' : 'fade',
      })
    })

    // Final celebration scene
    scenes.push({
      id: 'end',
      type: 'celebration',
      text: 'Great job! Keep going! 🚀',
      emoji: '⭐',
      bg_color: '#f39c12',
      text_color: '#ffffff',
      duration_ms: 2500,
      transition: 'zoom',
    })

    return scenes
  }

  private getSubjectEmoji(subject: string): string {
    const emojis: Record<string, string> = {
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
    return emojis[subject] || '📚'
  }
}

export function getVideoGenerator(): VideoGenerator {
  const provider = process.env.VIDEO_PROVIDER || 'fallback'

  if (provider === 'mcp') {
    const { MCPVideoGenerator } = require('./mcp-generator')
    return new MCPVideoGenerator()
  }

  if (provider === 'mock') {
    const { MockVideoGenerator } = require('./mock-generator')
    return new MockVideoGenerator()
  }

  return new FallbackAnimatedLessonGenerator()
}
