'use client'

import { useState, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'
import {
  loadVersions,
  createVersion,
  deleteVersion,
  getActiveId,
  setActiveId,
  CvVersion,
} from '@/lib/versions'
import { Layers, Plus, Trash2, Check } from 'lucide-react'

interface Props {
  form: UseFormReturn<CvConfig>
  onVersionSwitch: (config: CvConfig) => void
  versionsVersion: number
}

export function VersionsControls({ form, onVersionSwitch, versionsVersion }: Props) {
  const [open, setOpen] = useState(false)
  const [versions, setVersions] = useState<CvVersion[]>([])
  const [activeId, setActiveIdState] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVersions(loadVersions())
    setActiveIdState(getActiveId())
  }, [open, versionsVersion])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleNew() {
    const name = window.prompt('Nazwa nowej wersji CV:', 'Moje CV')
    if (!name) return
    const config = form.getValues()
    createVersion(name.trim() || 'Moje CV', config as CvConfig)
    setVersions(loadVersions())
    setActiveIdState(getActiveId())
  }

  function handleSwitch(version: CvVersion) {
    if (version.id === activeId) return
    setActiveId(version.id)
    setActiveIdState(version.id)
    form.reset(version.config)
    onVersionSwitch(version.config)
    setOpen(false)
  }

  function handleDelete(version: CvVersion, e: React.MouseEvent) {
    e.stopPropagation()
    if (!window.confirm(`Usunac wersje "${version.name}"? Tej operacji nie mozna cofnac.`)) return
    const updated = deleteVersion(version.id)
    setVersions(updated)
    const newActiveId = getActiveId()
    setActiveIdState(newActiveId)
    if (newActiveId) {
      const active = updated.find((v) => v.id === newActiveId)
      if (active) {
        form.reset(active.config)
        onVersionSwitch(active.config)
      }
    }
  }

  const activeName = versions.find((v) => v.id === activeId)?.name

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-lg transition-all bg-white dark:bg-gray-800 max-w-[140px]"
        title="Zarzadzaj wersjami CV"
      >
        <Layers size={13} className="flex-shrink-0" />
        <span className="truncate">{activeName ?? 'Wersje CV'}</span>
      </button>

      {open && (
        <div className="absolute bottom-full mb-1 left-0 z-50 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Wersje CV</p>
            <button
              type="button"
              onClick={handleNew}
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Plus size={11} />
              Nowa wersja
            </button>
          </div>

          {versions.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-gray-400 mb-2">Brak zapisanych wersji</p>
              <button
                type="button"
                onClick={handleNew}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Zapisz biezace CV jako wersje
              </button>
            </div>
          ) : (
            <ul className="max-h-48 overflow-y-auto">
              {versions.map((version) => (
                <li
                  key={version.id}
                  onClick={() => handleSwitch(version)}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 last:border-0 ${
                    version.id === activeId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {version.id === activeId && <Check size={11} className="text-blue-600 flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${version.id === activeId ? 'text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {version.name}
                      </p>
                      <p className="text-xs text-gray-400">{new Date(version.updatedAt).toLocaleDateString('pl-PL')}</p>
                    </div>
                  </div>
                  {versions.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(version, e)}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
