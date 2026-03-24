import { CvConfig } from './schema'

export const VERSIONS_KEY = 'cvcraft-versions'
export const ACTIVE_VERSION_KEY = 'cvcraft-active-id'

export interface CvVersion {
  id: string
  name: string
  config: CvConfig
  updatedAt: number
}

export function loadVersions(): CvVersion[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(VERSIONS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CvVersion[]
  } catch {
    return []
  }
}

export function saveVersions(versions: CvVersion[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions))
  } catch {
    // ignore
  }
}

export function getActiveId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACTIVE_VERSION_KEY)
}

export function setActiveId(id: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACTIVE_VERSION_KEY, id)
}

export function updateActiveVersion(config: CvConfig): void {
  const id = getActiveId()
  if (!id) return
  const versions = loadVersions()
  const idx = versions.findIndex((v) => v.id === id)
  if (idx === -1) return
  versions[idx] = { ...versions[idx], config, updatedAt: Date.now() }
  saveVersions(versions)
}

export function createVersion(name: string, config: CvConfig): CvVersion {
  const version: CvVersion = {
    id: crypto.randomUUID(),
    name,
    config,
    updatedAt: Date.now(),
  }
  const versions = loadVersions()
  saveVersions([version, ...versions])
  setActiveId(version.id)
  return version
}

export function deleteVersion(id: string): CvVersion[] {
  const versions = loadVersions().filter((v) => v.id !== id)
  saveVersions(versions)
  const activeId = getActiveId()
  if (activeId === id) {
    if (versions.length > 0) setActiveId(versions[0].id)
    else localStorage.removeItem(ACTIVE_VERSION_KEY)
  }
  return versions
}
