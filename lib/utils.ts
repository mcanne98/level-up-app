import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function xpToLevel(xp: number): number {
  // Level = floor(1 + sqrt(xp / 100))
  return Math.floor(1 + Math.sqrt(xp / 100))
}

export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100
}

export function xpProgressPercent(xp: number): number {
  const level = xpToLevel(xp)
  const currentLevelXp = Math.pow(level - 1, 2) * 100
  const nextLevelXp = Math.pow(level, 2) * 100
  return Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100)
}

export function gradeLabel(grade: number): string {
  if (grade === 0) return 'Kindergarten'
  if (grade <= 8) return `Grade ${grade}`
  return `Grade ${grade}`
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

export function getDifficultyLabel(difficulty: number): string {
  const labels = ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert']
  return labels[difficulty] || 'Medium'
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    Math: 'bg-blue-500',
    Science: 'bg-green-500',
    Language: 'bg-purple-500',
    History: 'bg-amber-500',
    Geography: 'bg-teal-500',
    Arts: 'bg-pink-500',
    Music: 'bg-indigo-500',
    'Physical Education': 'bg-orange-500',
    Technology: 'bg-cyan-500',
    Health: 'bg-red-500',
  }
  return colors[subject] || 'bg-slate-500'
}

export function getModeColor(mode: string): string {
  const colors: Record<string, string> = {
    curiosity: 'bg-yellow-500',
    school: 'bg-blue-500',
    mission_intro: 'bg-green-500',
  }
  return colors[mode] || 'bg-slate-500'
}

export function getModeLabel(mode: string): string {
  const labels: Record<string, string> = {
    curiosity: 'Curiosity',
    school: 'School',
    mission_intro: 'Mission',
  }
  return labels[mode] || mode
}

export function getModeEmoji(mode: string): string {
  const emojis: Record<string, string> = {
    curiosity: '✨',
    school: '📚',
    mission_intro: '🎯',
  }
  return emojis[mode] || '📖'
}
