import type { ActivityResult } from './types'

export const COMPLETIONS_KEY = 'adventure-activity-completions'

export interface StoredCompletion extends ActivityResult {
  day: string
}

function readCompletions(): StoredCompletion[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(COMPLETIONS_KEY) ?? '[]') as StoredCompletion[]
  } catch {
    return []
  }
}

export function argentinaDay(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function getCompletions(studentId: string): StoredCompletion[] {
  return readCompletions().filter((completion) => completion.studentId === studentId)
}

export function getTodayCompletion(studentId: string, activityId: string): StoredCompletion | undefined {
  const day = argentinaDay()
  return getCompletions(studentId).find(
    (completion) => completion.activityId === activityId && completion.day === day,
  )
}

export function getCompletedActivityIds(studentId: string): Set<string> {
  return new Set(getCompletions(studentId).map((completion) => completion.activityId))
}

export function recordCompletion(completion: Omit<StoredCompletion, 'day'>): {
  completion: StoredCompletion
  firstCompletion: boolean
  alreadyCompletedToday: boolean
} {
  const all = readCompletions()
  const day = argentinaDay()
  const today = all.find(
    (item) =>
      item.studentId === completion.studentId &&
      item.activityId === completion.activityId &&
      item.day === day,
  )
  if (today) return { completion: today, firstCompletion: false, alreadyCompletedToday: true }

  const firstCompletion = !all.some(
    (item) => item.studentId === completion.studentId && item.activityId === completion.activityId,
  )
  const stored = { ...completion, day }
  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify([...all, stored]))
  return { completion: stored, firstCompletion, alreadyCompletedToday: false }
}
