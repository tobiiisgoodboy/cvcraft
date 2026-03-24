'use client'

import { useState, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'
import { loadHistory, HistoryEntry } from '@/lib/history'
import { History } from 'lucide-react'

interface Props {
  form: UseFormReturn<CvConfig>
  historyVersion: number
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return `Dzisiaj ${formatTime(ts)}`
  return `${d.getDate()}.${d.getMonth() + 1} ${formatTime(ts)}`
}

export function HistoryControls({ form, historyVersion }: Props) {
  const [open, setOpen] = useState(false)
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setEntries(loadHistory())
  }, [open, historyVersion])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleRestore(entry: HistoryEntry) {
    if (window.confirm(`Przywrocic wersje z ${formatDate(entry.timestamp)}? Biezace zmiany zostana zastapione.`)) {
      form.reset(entry.snapshot)
      setOpen(false)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-lg transition-all bg-white dark:bg-gray-800"
        title="Historia zmian (ostatnie 5 wersji)"
      >
        <History size={13} />
        Historia
      </button>

      {open && (
        <div className="absolute bottom-full mb-1 left-0 z-50 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Ostatnie wersje (maks. 5)</p>
          </div>
          {entries.length === 0 ? (
            <p className="px-3 py-4 text-xs text-gray-400 text-center">Brak zapisanych wersji</p>
          ) : (
            <ul className="max-h-48 overflow-y-auto">
              {entries.map((entry, i) => (
                <li key={entry.timestamp} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{formatDate(entry.timestamp)}</p>
                    {i === 0 && <p className="text-xs text-blue-500">Najnowsza</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRestore(entry)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0 ml-2"
                  >
                    Przywroc
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
