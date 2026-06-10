import type {
  ChildProfile,
  LearningChain,
  ChainProgress,
  RecommendedChain,
  RecommendationScore,
} from '@/types'

interface ScoringContext {
  child: ChildProfile
  childInterests: string[]
  completedChainIds: Set<string>
  inProgressChains: Map<string, ChainProgress>
  weakSubjects: string[]
}

export function scoreChain(chain: LearningChain, ctx: ScoringContext): RecommendationScore {
  const score: RecommendationScore = {
    chain_id: chain.id,
    interest_match: 0,
    grade_match: 0,
    subject_need: 0,
    difficulty_match: 0,
    weak_area_boost: 0,
    novelty_bonus: 0,
    chain_completion_priority: 0,
    total: 0,
  }

  // Interest match (0-30 points)
  const interestOverlap = chain.interest_tags.filter(tag =>
    ctx.childInterests.some(ci => ci.toLowerCase() === tag.toLowerCase())
  ).length
  score.interest_match = Math.min(30, interestOverlap * 15)

  // Grade match (0-25 points)
  const { grade } = ctx.child
  if (grade >= chain.grade_min && grade <= chain.grade_max) {
    const midpoint = (chain.grade_min + chain.grade_max) / 2
    const distance = Math.abs(grade - midpoint)
    score.grade_match = Math.max(0, 25 - distance * 5)
  }

  // Weak area boost (0-20 points)
  const schoolLesson = chain.school_lesson
  if (schoolLesson && ctx.weakSubjects.includes(schoolLesson.subject)) {
    score.weak_area_boost = 20
  }

  // Novelty bonus — hasn't seen it yet (0-15 points)
  if (!ctx.completedChainIds.has(chain.id) && !ctx.inProgressChains.has(chain.id)) {
    score.novelty_bonus = 15
  }

  // Chain completion priority — started but not finished (0-10 points)
  const progress = ctx.inProgressChains.get(chain.id)
  if (progress) {
    if (progress.curiosity_completed && !progress.school_completed) {
      score.chain_completion_priority = 10
    } else if (progress.school_completed && !progress.mission_completed) {
      score.chain_completion_priority = 8
    }
  }

  score.total =
    score.interest_match +
    score.grade_match +
    score.subject_need +
    score.difficulty_match +
    score.weak_area_boost +
    score.novelty_bonus +
    score.chain_completion_priority

  return score
}

export function rankChains(
  chains: LearningChain[],
  ctx: ScoringContext
): RecommendedChain[] {
  return chains
    .filter(chain => !ctx.completedChainIds.has(chain.id) || ctx.inProgressChains.has(chain.id))
    .map(chain => {
      const scored = scoreChain(chain, ctx)
      const progress = ctx.inProgressChains.get(chain.id)
      const reasons = buildReasons(scored, ctx)
      const next_step = determineNextStep(progress)

      return {
        chain,
        score: scored.total,
        reasons,
        next_step,
        progress,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}

function determineNextStep(progress?: ChainProgress): 'curiosity' | 'school' | 'mission' {
  if (!progress || !progress.curiosity_completed) return 'curiosity'
  if (!progress.school_completed) return 'school'
  return 'mission'
}

function buildReasons(score: RecommendationScore, ctx: ScoringContext): string[] {
  const reasons: string[] = []
  if (score.interest_match > 0) reasons.push('Matches your interests')
  if (score.grade_match > 20) reasons.push(`Perfect for Grade ${ctx.child.grade}`)
  if (score.weak_area_boost > 0) reasons.push('Helps strengthen a weak area')
  if (score.chain_completion_priority > 0) reasons.push('Continue where you left off')
  if (score.novelty_bonus > 0) reasons.push('Something new to explore')
  return reasons
}
