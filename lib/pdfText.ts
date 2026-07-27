// Wbudowane/subsetowane fonty PDF (Open Sans, PT Serif, Roboto — podzbior latin-ext)
// nie zawieraja glifow strzalek (blok Unicode "Arrows", U+2190–U+21FF itp.),
// wiec taki znak nie renderuje sie w PDF. Zamieniamy je na bezpieczne odpowiedniki ASCII.
const ARROW_REPLACEMENTS: Array<[RegExp, string]> = [
  // dwukierunkowe najpierw: ↔ ⇔ ⟷ ⬌ ⇆ ⇄
  [/[\u2194\u21D4\u27F7\u2B0C\u21C6\u21C4]/g, '<->'],
  // w prawo: → ⇒ ⟶ ➔ ➙ ➛ ➜ ➝ ➞ ➟ ➠ ⟹ ⭢ ⮕ ▶
  [/[\u2192\u21D2\u27F6\u2794\u2799\u279C\u279D\u279E\u279F\u27A0\u27F9\u2B62\u2B95\u2BC8\u25B6]/g, '->'],
  // w lewo: ← ⇐ ⟵ ⬅ ⭠ ◀
  [/[\u2190\u21D0\u27F5\u2B05\u2B60\u25C0]/g, '<-'],
]

function sanitizeStr(value: string): string {
  let out = value
  for (const [re, rep] of ARROW_REPLACEMENTS) out = out.replace(re, rep)
  return out
}

// Rekurencyjnie zamienia strzalki we wszystkich polach tekstowych configu.
// Pomija pola "photo" (base64 data URL) — nie ma tam strzalek, a sa duze.
export function sanitizePdfConfig<T>(value: T, key?: string): T {
  if (key === 'photo') return value
  if (typeof value === 'string') return sanitizeStr(value) as unknown as T
  if (Array.isArray(value)) return value.map((v) => sanitizePdfConfig(v)) as unknown as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = sanitizePdfConfig(v, k)
    return out as T
  }
  return value
}
