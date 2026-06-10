import type { VideoGenerator } from './types'
import type { VideoGenerationInput, VideoGenerationResult } from '@/types'

export class MockVideoGenerator implements VideoGenerator {
  async generateVideo(input: VideoGenerationInput): Promise<VideoGenerationResult> {
    console.log('[MockVideoGenerator] Generating video for:', input.title)
    return {
      jobId: `mock_${Date.now()}_${input.lessonId}`,
      provider: 'mock',
      estimatedSeconds: 5,
    }
  }

  async getStatus(jobId: string) {
    // Mock always returns completed after a short delay
    return {
      status: 'completed' as const,
      url: `https://example.com/mock-video/${jobId}.mp4`,
    }
  }
}
