import type { VideoGenerationInput, VideoGenerationResult, VideoJobStatus } from '@/types'

export interface VideoGenerator {
  generateVideo(input: VideoGenerationInput): Promise<VideoGenerationResult>
  getStatus(jobId: string): Promise<{ status: VideoJobStatus; url?: string; error?: string }>
}
