'use client'

import { UseFormReturn } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'

interface Props {
  form: UseFormReturn<CvConfig>
}

export function SectionSummary({ form }: Props) {
  const { register } = form

  return (
    <div>
      <p className="text-sm text-gray-600 mb-3">
        Krotkie podsumowanie zawodowe — kim jestes, co oferujesz, jakie sa Twoje cele.
      </p>
      <textarea
        {...register('summary')}
        rows={6}
        placeholder="Doswiadczony programista z 5-letnim stazem w tworzeniu aplikacji webowych. Specjalizuje sie w React i Node.js. Szukam nowych wyzwan w innowacyjnym srodowisku..."
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white placeholder:text-gray-300 resize-none leading-relaxed"
      />
    </div>
  )
}
