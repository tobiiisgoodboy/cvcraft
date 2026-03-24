'use client'

import { Document } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'
import { ClassicTemplate } from './templates/ClassicTemplate'
import { ModernTemplate } from './templates/ModernTemplate'
import { MinimalTemplate } from './templates/MinimalTemplate'

interface Props {
  config: CvConfig
  qrDataUrl?: string | null
}

export function PdfDocument({ config, qrDataUrl }: Props) {
  switch (config.meta.template) {
    case 'modern':
      return (
        <Document>
          <ModernTemplate config={config} qrDataUrl={qrDataUrl} />
        </Document>
      )
    case 'minimal':
      return (
        <Document>
          <MinimalTemplate config={config} qrDataUrl={qrDataUrl} />
        </Document>
      )
    default:
      return (
        <Document>
          <ClassicTemplate config={config} qrDataUrl={qrDataUrl} />
        </Document>
      )
  }
}
