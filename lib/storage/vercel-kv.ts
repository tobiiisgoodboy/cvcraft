// import { StorageAdapter } from './adapter'
// import { kv } from '@vercel/kv'
//
// export class VercelKVAdapter implements StorageAdapter {
//   async save(key: string, data: unknown): Promise<void> {
//     await kv.set(key, JSON.stringify(data))
//   }
//
//   async load(key: string): Promise<unknown | null> {
//     const item = await kv.get<string>(key)
//     if (!item) return null
//     try {
//       return JSON.parse(item)
//     } catch {
//       return null
//     }
//   }
// }

export {}
