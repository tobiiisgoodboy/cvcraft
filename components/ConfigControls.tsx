'use client'

import { useRef, useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { CvConfig, CvConfigSchema } from '@/lib/schema'
import { defaultCvConfig } from '@/lib/defaults'
import { Download, Upload, RotateCcw, Copy, CheckCircle2, AlertCircle } from 'lucide-react'

interface Props {
  form: UseFormReturn<CvConfig>
}

type Toast = { type: 'success' | 'error'; message: string }

export function ConfigControls({ form }: Props) {
  const { getValues, reset } = form
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  function handleExport() {
    const data = getValues()
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cvcraft-config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target?.result as string)
        const parsed = CvConfigSchema.parse(raw)
        reset(parsed)
        setToast({ type: 'success', message: 'Wczytano ustawienia z pliku.' })
      } catch (err) {
        setToast({ type: 'error', message: 'Nie udalo sie wczytac pliku. Sprawdz, czy JSON jest prawidlowy.' })
        console.error(err)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleDuplicate() {
    const name = window.prompt('Podaj nazwe kopii CV:', 'Moje CV')
    if (!name) return
    const data = getValues()
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.replace(/[^a-zA-Z0-9\-_. ]/g, '').trim() || 'cv'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClear() {
    if (window.confirm('Czy na pewno chcesz wyczysc wszystkie dane CV? Tej operacji nie mozna cofnac.')) {
      reset(defaultCvConfig)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDuplicate}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-lg transition-all bg-white dark:bg-gray-800"
        title="Duplikuj CV do pliku JSON"
      >
        <Copy size={13} />
        Duplikuj
      </button>

      <button
        type="button"
        onClick={handleExport}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-lg transition-all bg-white dark:bg-gray-800"
        title="Eksportuj konfiguracje do pliku JSON"
      >
        <Download size={13} />
        Eksportuj JSON
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-lg transition-all bg-white dark:bg-gray-800"
        title="Importuj konfiguracje z pliku JSON"
      >
        <Upload size={13} />
        Importuj JSON
      </button>

      <button
        type="button"
        onClick={handleClear}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-all bg-white dark:bg-gray-800"
        title="Wyczysc wszystkie dane"
      >
        <RotateCcw size={13} />
        Wyczysc
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      {toast && (
        <div
          role="status"
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl text-base font-semibold border-2 animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
          {toast.message}
        </div>
      )}
    </div>
  )
}
