'use client'

import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

interface Props {
  form: UseFormReturn<CvConfig>
}

const inputClass =
  'w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white placeholder:text-gray-300'

const labelClass = 'text-sm font-semibold text-gray-800'

function newItem() {
  return {
    id: crypto.randomUUID(),
    name: '',
    issuer: '',
    date: '',
    url: '',
  }
}

export function SectionCertificates({ form }: Props) {
  const { register, control } = form
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'certificates',
  })

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">
          Brak certyfikatow. Dodaj kursy, szkolenia, certyfikaty zawodowe.
        </p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Certyfikat {index + 1}
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
            <label className={labelClass}>Nazwa certyfikatu</label>
            <input
              {...register(`certificates.${index}.name`)}
              placeholder="AWS Certified Developer"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Wystawca (firma / organizacja)</label>
            <input
              {...register(`certificates.${index}.issuer`)}
              placeholder="Amazon Web Services"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Data uzyskania</label>
            <input
              {...register(`certificates.${index}.date`)}
              placeholder="06/2023"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>URL (link do certyfikatu, opcjonalny)</label>
            <input
              {...register(`certificates.${index}.url`)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append(newItem())}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all"
      >
        <Plus size={16} />
        Dodaj certyfikat
      </button>
    </div>
  )
}
