// Level Up - Core Types

export type UserRole = 'parent' | 'admin'
export type LessonMode = 'curiosity' | 'school' | 'mission_intro'
export type LessonStatus = 'draft' | 'review' | 'published' | 'archived'
export type SafetyStatus = 'pending' | 'approved' | 'flagged'
export type MasteryLevel = 'introduced' | 'practicing' | 'proficient' | 'mastered'
export type MissionProofType = 'parent_confirmed' | 'photo_upload' | 'self_report'
export type RedemptionStatus = 'requested' | 'approved' | 'redeemed' | 'rejected'
export type ProgressStatus = 'not_started' | 'started' | 'completed'
export type MissionStatus = 'assigned' | 'submitted' | 'completed' | 'approved'
export type VideoProvider = 'mock' | 'mcp' | 'fallback'
export type VideoJobStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type SegmentType = 'hook' | 'teach' | 'example' | 'quiz' | 'reinforce' | 'reward'
export type EducationLevel = 'elementary' | 'secondary' | 'college' | 'university' | 'professional'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface ParentProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  created_at: string
}

export interface ChildProfile {
  id: string
  parent_id: string
  first_name: string
  display_name: string
  age: number
  grade: number
  province: string
  country: string
  avatar_url?: string
  daily_time_limit_minutes: number
  current_xp: number
  current_level: number
  created_at: string
}

export interface Interest {
  id: string
  name: string
  category: string
  emoji?: string
}

export interface Lesson {
  id: string
  title: string
  mode: LessonMode
  category: string
  subject: string
  grade_min: number
  grade_max: number
  difficulty: number
  hook: string
  script?: string
  summary?: string
  estimated_duration_seconds: number
  video_url?: string
  fallback_animation_json?: LessonAnimation
  status: LessonStatus
  safety_status: SafetyStatus
  created_by?: string
  interest_tags: string[]
  thumbnail_emoji: string
  created_at: string
  updated_at: string
  // Relations
  quizzes?: Quiz[]
  segments?: LessonSegment[]
}

export interface LessonSegment {
  id: string
  lesson_id: string
  segment_type: SegmentType
  content: SegmentContent
  order_index: number
}

export interface SegmentContent {
  text?: string
  emoji?: string
  image_url?: string
  duration_ms?: number
  animation?: string
  bg_color?: string
  text_color?: string
}

export interface LessonAnimation {
  scenes: AnimationScene[]
  background_color?: string
  font_size?: number
}

export interface AnimationScene {
  id: string
  type: 'title' | 'fact' | 'question' | 'answer' | 'celebration'
  text: string
  emoji?: string
  bg_color: string
  text_color: string
  duration_ms: number
  transition?: 'fade' | 'slide' | 'zoom'
}

export interface Quiz {
  id: string
  lesson_id: string
  question: string
  explanation?: string
  options: QuizOption[]
}

export interface QuizOption {
  id: string
  quiz_id: string
  option_text: string
  is_correct: boolean
}

export interface Mission {
  id: string
  title: string
  description: string
  category: string
  proof_type: MissionProofType
  xp_reward: number
  emoji: string
  created_at: string
}

export interface ChildMission {
  id: string
  child_id: string
  mission_id: string
  status: MissionStatus
  submitted_proof_url?: string
  parent_approved_at?: string
  completed_at?: string
  mission?: Mission
}

export interface LearningChain {
  id: string
  title: string
  curiosity_lesson_id: string
  school_lesson_id: string
  mission_id: string
  reward_value: number
  interest_tags: string[]
  grade_min: number
  grade_max: number
  created_at: string
  // Relations
  curiosity_lesson?: Lesson
  school_lesson?: Lesson
  mission?: Mission
}

export interface ChainProgress {
  id: string
  child_id: string
  learning_chain_id: string
  curiosity_completed: boolean
  school_completed: boolean
  mission_completed: boolean
  reward_unlocked: boolean
  completed_at?: string
  chain?: LearningChain
}

export interface XPEvent {
  id: string
  child_id: string
  source_type: string
  source_id?: string
  xp_amount: number
  created_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon_url?: string
  emoji: string
  criteria_json?: Record<string, unknown>
  created_at: string
}

export interface ChildBadge {
  id: string
  child_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
}

export interface ParentReward {
  id: string
  parent_id: string
  title: string
  description?: string
  cost_points: number
  emoji: string
  is_active: boolean
  created_at: string
}

export interface RewardRedemption {
  id: string
  child_id: string
  reward_id: string
  status: RedemptionStatus
  requested_at: string
  approved_at?: string
  redeemed_at?: string
  reward?: ParentReward
}

// Curriculum types
export interface CurriculumRegion {
  id: string
  country: string
  province_or_state?: string
  name: string
  source_url?: string
  version?: string
  effective_date?: string
}

export interface CurriculumSubject {
  id: string
  region_id: string
  name: string
  education_level: EducationLevel
}

export interface CurriculumCourse {
  id: string
  subject_id: string
  grade_id: string
  course_code?: string
  course_name: string
}

export interface CurriculumExpectation {
  id: string
  strand_id: string
  expectation_code?: string
  expectation_text: string
  parent_expectation_id?: string
}

export interface CurriculumConcept {
  id: string
  expectation_id: string
  concept_name: string
  concept_description?: string
  prerequisite_concepts_json: string[]
}

// Video generation types
export interface VideoGenerationInput {
  lessonId: string
  title: string
  script: string
  hook: string
  grade: number
  subject: string
  duration_seconds: number
}

export interface VideoGenerationResult {
  jobId: string
  provider: VideoProvider
  estimatedSeconds?: number
}

export interface VideoJob {
  id: string
  lesson_id: string
  provider: VideoProvider
  status: VideoJobStatus
  job_id_external?: string
  result_url?: string
  error_message?: string
  created_at: string
  updated_at: string
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface RecommendedChain {
  chain: LearningChain
  score: number
  reasons: string[]
  next_step: 'curiosity' | 'school' | 'mission'
  progress?: ChainProgress
}

// Recommendation scoring
export interface RecommendationScore {
  chain_id: string
  interest_match: number
  grade_match: number
  subject_need: number
  difficulty_match: number
  weak_area_boost: number
  novelty_bonus: number
  chain_completion_priority: number
  total: number
}

// Lesson generation
export interface LessonGenerationInput {
  grade: number
  subject: string
  expectation_text: string
  concept_name: string
  interest_anchor: string
  difficulty: number
  duration_seconds: number
  mode: LessonMode
}

export interface GeneratedLesson {
  title: string
  hook: string
  script: string
  summary: string
  quiz: {
    question: string
    options: { text: string; correct: boolean }[]
    explanation: string
  }
  mission: {
    title: string
    description: string
    proof_type: MissionProofType
  }
  storyboard: AnimationScene[]
  interest_tags: string[]
  thumbnail_emoji: string
}
