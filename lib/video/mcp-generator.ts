import type { VideoGenerator } from './types'
import type { VideoGenerationInput, VideoGenerationResult, VideoJobStatus } from '@/types'

/**
 * Generic MCP-compatible video generation adapter.
 * Configure via environment variables — no vendor hardcoding.
 */
export class MCPVideoGenerator implements VideoGenerator {
  private serverUrl: string
  private apiKey: string
  private toolName: string

  constructor() {
    this.serverUrl = process.env.MCP_VIDEO_SERVER_URL || ''
    this.apiKey = process.env.MCP_VIDEO_API_KEY || ''
    this.toolName = process.env.MCP_VIDEO_TOOL_NAME || 'generate_video'
  }

  async generateVideo(input: VideoGenerationInput): Promise<VideoGenerationResult> {
    if (!this.serverUrl || !this.apiKey) {
      throw new Error('MCP video generator not configured. Set MCP_VIDEO_SERVER_URL and MCP_VIDEO_API_KEY.')
    }

    const response = await fetch(`${this.serverUrl}/tools/${this.toolName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        title: input.title,
        script: input.script,
        hook: input.hook,
        grade: input.grade,
        subject: input.subject,
        duration_seconds: input.duration_seconds,
        lesson_id: input.lessonId,
      }),
    })

    if (!response.ok) {
      throw new Error(`MCP video server error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      jobId: data.job_id,
      provider: 'mcp',
      estimatedSeconds: data.estimated_seconds,
    }
  }

  async getStatus(jobId: string): Promise<{ status: VideoJobStatus; url?: string; error?: string }> {
    if (!this.serverUrl || !this.apiKey) {
      return { status: 'failed', error: 'MCP generator not configured' }
    }

    const response = await fetch(`${this.serverUrl}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    })

    if (!response.ok) {
      return { status: 'failed', error: response.statusText }
    }

    const data = await response.json()
    return {
      status: data.status,
      url: data.result_url,
      error: data.error,
    }
  }
}
