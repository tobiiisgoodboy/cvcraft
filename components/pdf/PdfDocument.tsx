'use client'

import { Document } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'
import { ClassicTemplate } from './templates/ClassicTemplate'
import { ModernTemplate } from './templates/ModernTemplate'
import { MinimalTemplate } from './templates/MinimalTemplate'

interface Props {
  config: CvConfig
}

export function PdfDocument({ config }: Props) {
  switch (config.meta.template) {
    case 'modern':
      return (
        <Document>
          <ModernTemplate config={config} />
        </Document>
      )
    case 'minimal':
      return (
        <Document>
          <MinimalTemplate config={config} />
        </Document>
      )
    default:
      return (
        <Document>
          <ClassicTemplate config={config} />
        </Document>
      )
  }
}
