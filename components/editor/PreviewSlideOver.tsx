'use client'

import { useEffect } from 'react'
import { X, RefreshCw } from 'lucide-react'
import dynamic from 'next/dynamic'
import { CvConfig } from '@/lib/schema'

const PdfPreview = dynamic(
  () => import('@/components/pdf/PdfPreview').then((m) => m.PdfPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Ladowanie podgladu...
      </div>
    ),
  }
)

interface Props {
  config: CvConfig
  onClose: () => void
  onRefresh: () => void
  onTemplateChange: (t: 'classic' | 'modern' | 'minimal') => void
  onAccentColorChange: (c: string) => void
  onPhotoPositionChange: (p: 'left' | 'right' | 'none') => void
  onFontChange: (f: 'Helvetica' | 'Times-Roman' | 'Roboto') => void
  onBgColorChange: (c: string) => void
  onTextColorChange: (c: string) => void
  onSkillLayoutChange: (l: 'bars' | 'tags' | 'dots' | 'list' | 'categories') => void
  onMarginsChange: (m: 'narrow' | 'normal' | 'wide') => void
  onPdfLanguageChange: (l: 'pl' | 'en') => void
  onQrChange: (p: Partial<{ enabled: boolean; target: 'linkedin' | 'website' }>) => void
  onGdprChange: (p: Partial<{ enabled: boolean; language: 'pl' | 'en'; text: string; company: string }>) => void
}

export function PreviewSlideOver({ config, onClose, onRefresh, ...handlers }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[540px] z-50 flex flex-col bg-white dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Podglad CV
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              title="Odswiez podglad aktualnym stanem formularza"
            >
              <RefreshCw size={12} />
              Odswiez
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-1"
              title="Zamknij (Esc)"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* PDF preview */}
        <div className="flex-1 overflow-hidden">
          <PdfPreview
            config={config}
            onBackToEdit={onClose}
            {...handlers}
          />
        </div>
      </div>
    </>
  )
}
