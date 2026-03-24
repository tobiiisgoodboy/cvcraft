'use client'

import { useState, useEffect } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import QRCode from 'qrcode'
import { CvConfig } from '@/lib/schema'
import { PdfDocument } from './PdfDocument'
import { estimatePageCount } from '@/lib/pageEstimate'
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
  onBgColorChange: (color: string) => void
  onTextColorChange: (color: string) => void
  onSkillLayoutChange: (layout: 'bars' | 'tags' | 'dots' | 'list' | 'categories') => void
  onMarginsChange: (margins: 'narrow' | 'normal' | 'wide') => void
  onPdfLanguageChange: (lang: 'pl' | 'en') => void
  onQrChange: (patch: Partial<{ enabled: boolean; target: 'linkedin' | 'website' }>) => void
  onGdprChange: (patch: Partial<{ enabled: boolean; language: 'pl' | 'en'; text: string; company: string }>) => void
}

const TEMPLATES = [
  { id: 'classic' as const, label: 'Klasyczny' },
  { id: 'modern' as const, label: 'Nowoczesny' },
  { id: 'minimal' as const, label: 'Minimalistyczny' },
]

export function PdfPreview({ config, onTemplateChange, onAccentColorChange, onPhotoPositionChange, onFontChange, onBgColorChange, onTextColorChange, onSkillLayoutChange, onMarginsChange, onPdfLanguageChange, onQrChange, onGdprChange }: Props) {
  const [isClient, setIsClient] = useState(false)
  const [pdfKey, setPdfKey] = useState(0)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setPdfKey((k) => k + 1)
  }, [config.meta.template])

  useEffect(() => {
    if (!config.meta.qrEnabled) { setQrDataUrl(null); return }
    const raw = config.meta.qrTarget === 'website' ? config.personal.website : config.personal.linkedin
    if (!raw) { setQrDataUrl(null); return }
    const url = raw.startsWith('http') ? raw : `https://${raw}`
    QRCode.toDataURL(url, { width: 128, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null))
  }, [config.meta.qrEnabled, config.meta.qrTarget, config.personal.linkedin, config.personal.website])

  const fullName =
    [config.personal.firstName, config.personal.lastName].filter(Boolean).join(' ') || 'cv'
  const fileName = `${fullName.replace(/\s+/g, '_')}.pdf`
  const estimatedPages = estimatePageCount(config)

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

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Układ umiejetnosci</p>
          <div className="flex gap-2">
            {([
              { id: 'categories' as const, label: '\u229E Kategorie' },
              { id: 'tags' as const, label: '# Tagi' },
              { id: 'list' as const, label: '\u2261 Lista' },
            ]).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSkillLayoutChange(opt.id)}
                className={`flex-1 py-1.5 px-1 text-xs rounded-md border transition-all ${
                  config.meta.skillLayout === opt.id
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
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Kod QR</p>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={config.meta.qrEnabled ?? false}
                onChange={(e) => onQrChange({ enabled: e.target.checked })}
                className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
              />
              <span className="text-xs text-gray-600">Dodaj do PDF</span>
            </label>
          </div>
          {config.meta.qrEnabled && (
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {([
                  { id: 'linkedin' as const, label: 'LinkedIn' },
                  { id: 'website' as const, label: 'Strona www' },
                ]).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onQrChange({ target: opt.id })}
                    className={`py-1 px-3 text-xs rounded-md border transition-all ${
                      (config.meta.qrTarget ?? 'linkedin') === opt.id
                        ? 'bg-blue-600 text-white border-blue-600 font-medium'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {qrDataUrl && (
                <img src={qrDataUrl} alt="QR preview" className="w-8 h-8 rounded border border-gray-200" />
              )}
              {config.meta.qrEnabled && !qrDataUrl && (
                <span className="text-xs text-orange-400">Brak URL w danych osobowych</span>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Klauzula RODO</p>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={config.meta.gdprEnabled ?? false}
                onChange={(e) => onGdprChange({ enabled: e.target.checked })}
                className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
              />
              <span className="text-xs text-gray-600">Dodaj do PDF</span>
            </label>
          </div>
          {config.meta.gdprEnabled && (
            <div className="space-y-2">
              <div className="flex gap-2">
                {([
                  { id: 'pl' as const, label: 'PL' },
                  { id: 'en' as const, label: 'EN' },
                ]).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onGdprChange({ language: opt.id })}
                    className={`py-1 px-3 text-xs rounded-md border transition-all ${
                      (config.meta.gdprLanguage ?? 'pl') === opt.id
                        ? 'bg-blue-600 text-white border-blue-600 font-medium'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={config.meta.gdprCompany ?? ''}
                onChange={(e) => onGdprChange({ company: e.target.value })}
                placeholder="Nazwa firmy (opcjonalnie)"
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <textarea
                value={config.meta.gdprText ?? ''}
                onChange={(e) => onGdprChange({ text: e.target.value })}
                placeholder="Tresc klauzuli (puste = tekst domyslny)"
                rows={3}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Jezyk PDF</p>
          <div className="flex gap-2">
            {([
              { id: 'pl' as const, label: 'Polski' },
              { id: 'en' as const, label: 'English' },
            ]).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onPdfLanguageChange(opt.id)}
                className={`flex-1 py-1.5 px-2 text-xs rounded-md border transition-all ${
                  (config.meta.pdfLanguage ?? 'pl') === opt.id
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
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Marginesy</p>
          <div className="flex gap-2">
            {([
              { id: 'narrow' as const, label: 'Waskie' },
              { id: 'normal' as const, label: 'Normalne' },
              { id: 'wide' as const, label: 'Szerokie' },
            ]).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onMarginsChange(opt.id)}
                className={`flex-1 py-1.5 px-2 text-xs rounded-md border transition-all ${
                  (config.meta.margins ?? 'normal') === opt.id
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
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Kolory</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-500">Akcent</label>
              <input
                type="color"
                value={config.meta.accentColor}
                onChange={(e) => onAccentColorChange(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-gray-300"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-500">Tlo</label>
              <input
                type="color"
                value={config.meta.bgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-gray-300"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-500">Tekst</label>
              <input
                type="color"
                value={config.meta.textColor}
                onChange={(e) => onTextColorChange(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border border-gray-300"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                onAccentColorChange('#2563eb')
                onBgColorChange('#ffffff')
                onTextColorChange('#111827')
              }}
              className="text-xs text-gray-400 hover:text-gray-600 underline ml-auto"
            >
              Reset
            </button>
            <span className="text-xs text-gray-400 ml-auto mr-1" title="Szacowana liczba stron">
              ~{estimatedPages} {estimatedPages === 1 ? 'strona' : estimatedPages < 5 ? 'strony' : 'stron'}
            </span>
            {isClient && (
              <>
                <PDFDownloadLink
                  document={<PdfDocument config={{ ...config, meta: { ...config.meta, pdfLanguage: 'pl' } }} qrDataUrl={qrDataUrl} />}
                  fileName={fileName.replace('.pdf', '_PL.pdf')}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors"
                  title="Pobierz wersje polska"
                >
                  <Download size={13} />
                  PL
                </PDFDownloadLink>
                <PDFDownloadLink
                  document={<PdfDocument config={{ ...config, meta: { ...config.meta, pdfLanguage: 'en' } }} qrDataUrl={qrDataUrl} />}
                  fileName={fileName.replace('.pdf', '_EN.pdf')}
                  className="flex items-center gap-1 bg-gray-700 hover:bg-gray-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors"
                  title="Download English version"
                >
                  <Download size={13} />
                  EN
                </PDFDownloadLink>
              </>
            )}
          </div>
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
            <PdfDocument config={config} qrDataUrl={qrDataUrl} />
          </PDFViewer>
        ) : (
          <PdfLoadingState />
        )}
      </div>
    </div>
  )
}
