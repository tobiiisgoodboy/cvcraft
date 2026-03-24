import { CvConfig } from './schema'

export const HISTORY_KEY = 'cvcraft-history'
export const HISTORY_MAX = 5

export interface HistoryEntry {
  timestamp: number
  snapshot: CvConfig
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

export function pushHistory(config: CvConfig): void {
  if (typeof window === 'undefined') return
  try {
    const history = loadHistory()
    const entry: HistoryEntry = { timestamp: Date.now(), snapshot: config }
    const updated = [entry, ...history].slice(0, HISTORY_MAX)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {
    // ignore storage errors
  }
}
