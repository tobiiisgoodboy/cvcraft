'use client'

import { useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { CvConfig, CvConfigSchema } from '@/lib/schema'
import { defaultCvConfig } from '@/lib/defaults'
import { Download, Upload, RotateCcw } from 'lucide-react'

interface Props {
  form: UseFormReturn<CvConfig>
}

export function ConfigControls({ form }: Props) {
  const { getValues, reset } = form
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      } catch (err) {
        alert('Nie udalo sie wczytac pliku konfiguracji. Upewnij sie, ze plik jest prawidlowy.')
        console.error(err)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
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
        onClick={handleExport}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg transition-all bg-white"
        title="Eksportuj konfiguracje do pliku JSON"
      >
        <Download size={13} />
        Eksportuj JSON
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg transition-all bg-white"
        title="Importuj konfiguracje z pliku JSON"
      >
        <Upload size={13} />
        Importuj JSON
      </button>

      <button
        type="button"
        onClick={handleClear}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-all bg-white"
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
    </div>
  )
}
