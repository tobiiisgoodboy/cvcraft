'use client'

import { useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'
import { calcCompletion } from '@/lib/completion'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  form: UseFormReturn<CvConfig>
}

function scoreColor(score: number): string {
  if (score >= 80) return '#16a34a'   // green
  if (score >= 50) return '#d97706'   // amber
  return '#dc2626'                     // red
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Świetne CV!'
  if (score >= 60) return 'Dobre CV'
  if (score >= 40) return 'Podstawowe CV'
  return 'Uzupełnij CV'
}

export function CompletionBar({ form }: Props) {
  const [expanded, setExpanded] = useState(false)
  const config = form.watch()
  const { score, missing } = useMemo(() => calcCompletion(config as CvConfig), [config])
  const color = scoreColor(score)

  return (
    <div className="flex-shrink-0 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
      {/* Main bar */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {/* Progress bar */}
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%`, backgroundColor: color }}
          />
        </div>

        {/* Score */}
        <span className="text-xs font-bold tabular-nums w-9 text-right" style={{ color }}>
          {score}%
        </span>

        {/* Label */}
        <span className="text-xs text-gray-500 dark:text-gray-400 w-28 text-left">{scoreLabel(score)}</span>

        {/* Toggle */}
        {expanded ? (
          <ChevronUp size={13} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={13} className="text-gray-400 flex-shrink-0" />
        )}
      </button>

      {/* Expanded: missing items */}
      {expanded && missing.length > 0 && (
        <div className="px-5 pb-3 space-y-1">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Brakujące elementy:</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((item, i) => (
              <span
                key={i}
                className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
