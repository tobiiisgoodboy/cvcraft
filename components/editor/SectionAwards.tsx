'use client'

import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

interface Props {
  form: UseFormReturn<CvConfig>
}

const inputClass =
  'w-full px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-600'

const labelClass = 'text-sm font-semibold text-gray-800 dark:text-gray-200'

function newItem() {
  return {
    id: crypto.randomUUID(),
    title: '',
    issuer: '',
    date: '',
    description: '',
  }
}

export function SectionAwards({ form }: Props) {
  const { register, control } = form
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'awards',
  })

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">
          Brak nagrod. Dodaj osiagniecia, wyroznienia, nagrody branzowe.
        </p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Nagroda {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => index > 0 && move(index, index - 1)}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => index < fields.length - 1 && move(index, index + 1)}
                disabled={index === fields.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
              >
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Tytul nagrody / wyroznienia</label>
            <input
              {...register(`awards.${index}.title`)}
              placeholder="Najlepszy pracownik roku"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Przyznajacy (organizacja / firma)</label>
            <input
              {...register(`awards.${index}.issuer`)}
              placeholder="Nazwa firmy lub organizacji"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Data</label>
            <input
              {...register(`awards.${index}.date`)}
              placeholder="2023"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Opis (opcjonalny)</label>
            <textarea
              {...register(`awards.${index}.description`)}
              placeholder="Krotki opis nagrody lub kontekstu..."
              rows={3}
              className={inputClass}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append(newItem())}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-all"
      >
        <Plus size={16} />
        Dodaj nagrode / wyroznienie
      </button>
    </div>
  )
}
