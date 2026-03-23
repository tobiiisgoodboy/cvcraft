import { LocalStorageAdapter } from './local'

export const storage = new LocalStorageAdapter()
export type { StorageAdapter } from './adapter'
