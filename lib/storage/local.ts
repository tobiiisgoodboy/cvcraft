import { StorageAdapter } from './adapter'

export class LocalStorageAdapter implements StorageAdapter {
  async save(key: string, data: unknown): Promise<void> {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.error('LocalStorage save failed:', e)
    }
  }

  async load(key: string): Promise<unknown | null> {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      return JSON.parse(item)
    } catch (e) {
      console.error('LocalStorage load failed:', e)
      return null
    }
  }
}
