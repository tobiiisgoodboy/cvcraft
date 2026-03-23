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
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Krotkie podsumowanie zawodowe — kim jestes, co oferujesz, jakie sa Twoje cele.
      </p>
      <textarea
        {...register('summary')}
        rows={6}
        placeholder="Doswiadczony programista z 5-letnim stazem w tworzeniu aplikacji webowych. Specjalizuje sie w React i Node.js. Szukam nowych wyzwan w innowacyjnym srodowisku..."
        className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none leading-relaxed"
      />
    </div>
  )
}
