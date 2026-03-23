'use client'

import { useState, useEffect } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'
import { PdfDocument } from './PdfDocument'
import { Download, FileText } from 'lucide-react'

function PdfLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
      <FileText size={40} className="opacity-40" />
      <p className="text-sm">Ladowanie podgladu PDF...</p>
    </div>
  )
}

interface Props {
  config: CvConfig
  onTemplateChange: (template: 'classic' | 'modern' | 'minimal') => void
  onAccentColorChange: (color: string) => void
  onPhotoPositionChange: (position: 'left' | 'right' | 'none') => void
  onFontChange: (font: 'Helvetica' | 'Times-Roman' | 'Roboto') => void
}

const TEMPLATES = [
  { id: 'classic' as const, label: 'Klasyczny' },
  { id: 'modern' as const, label: 'Nowoczesny' },
  { id: 'minimal' as const, label: 'Minimalistyczny' },
]

export function PdfPreview({ config, onTemplateChange, onAccentColorChange, onPhotoPositionChange, onFontChange }: Props) {
  const [isClient, setIsClient] = useState(false)
  const [pdfKey, setPdfKey] = useState(0)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setPdfKey((k) => k + 1)
  }, [config.meta.template])

  const fullName =
    [config.personal.firstName, config.personal.lastName].filter(Boolean).join(' ') || 'cv'
  const fileName = `${fullName.replace(/\s+/g, '_')}.pdf`

  return (
    <div className="flex flex-col h-full">
      {/* Template selector */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Szablon</p>
          <div className="flex gap-2">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onTemplateChange(tpl.id)}
                className={`flex-1 py-1.5 px-2 text-xs rounded-md border transition-all ${
                  config.meta.template === tpl.id
                    ? 'bg-blue-600 text-white border-blue-600 font-medium'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Zdjecie</p>
          <div className="flex gap-2">
            {([
              { id: 'none' as const, label: 'Brak' },
              { id: 'left' as const, label: 'Lewo' },
              { id: 'right' as const, label: 'Prawo' },
            ]).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onPhotoPositionChange(opt.id)}
                className={`flex-1 py-1.5 px-2 text-xs rounded-md border transition-all ${
                  config.meta.photoPosition === opt.id
                    ? 'bg-blue-600 text-white border-blue-600 font-medium'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Czcionka</p>
          <div className="flex gap-2">
            {([
              { id: 'Helvetica' as const, label: 'Helvetica' },
              { id: 'Times-Roman' as const, label: 'Times' },
              { id: 'Roboto' as const, label: 'Roboto' },
            ]).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onFontChange(opt.id)}
                className={`flex-1 py-1.5 px-2 text-xs rounded-md border transition-all ${
                  config.meta.font === opt.id
                    ? 'bg-blue-600 text-white border-blue-600 font-medium'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
              Kolor akcentu
            </label>
            <input
              type="color"
              value={config.meta.accentColor}
              onChange={(e) => onAccentColorChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-300"
            />
            <span className="text-xs text-gray-400 font-mono">{config.meta.accentColor}</span>
          </div>

          {isClient && (
            <PDFDownloadLink
              document={<PdfDocument config={config} />}
              fileName={fileName}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              <Download size={14} />
              Pobierz PDF
            </PDFDownloadLink>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative overflow-hidden bg-gray-100">
        {isClient ? (
          <PDFViewer
            key={pdfKey}
            width="100%"
            height="100%"
            showToolbar={false}
            style={{ border: 'none' }}
          >
            <PdfDocument config={config} />
          </PDFViewer>
        ) : (
          <PdfLoadingState />
        )}
      </div>
    </div>
  )
}
