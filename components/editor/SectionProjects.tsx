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
    description: '',
    url: '',
    technologies: '',
  }
}

export function SectionProjects({ form }: Props) {
  const { register, control } = form
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'projects',
  })

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">
          Brak projektow. Dodaj wlasne projekty, portfolio, open source.
        </p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Projekt {index + 1}
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
            <label className={labelClass}>Nazwa projektu</label>
            <input
              {...register(`projects.${index}.name`)}
              placeholder="Moja aplikacja"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Technologie</label>
            <input
              {...register(`projects.${index}.technologies`)}
              placeholder="React, Node.js, PostgreSQL"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Opis</label>
            <textarea
              {...register(`projects.${index}.description`)}
              rows={3}
              placeholder="Krotki opis projektu, jego celu i funkcjonalnosci..."
              className={inputClass + ' resize-none leading-relaxed'}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Link do projektu (opcjonalny)</label>
            <input
              {...register(`projects.${index}.url`)}
              placeholder="https://github.com/..."
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
        Dodaj projekt
      </button>
    </div>
  )
}
