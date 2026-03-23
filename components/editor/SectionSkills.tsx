'use client'

import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'
import { Plus, Trash2 } from 'lucide-react'

interface Props {
  form: UseFormReturn<CvConfig>
}

const inputClass =
  'w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white placeholder:text-gray-300'

const LEVELS = [
  { value: 'basic', label: 'Podstawowy' },
  { value: 'medium', label: 'Sredniozaawansowany' },
  { value: 'advanced', label: 'Zaawansowany' },
]

function newItem() {
  return {
    id: crypto.randomUUID(),
    name: '',
    level: 'medium' as const,
  }
}

export function SectionSkills({ form }: Props) {
  const { register, control } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  })

  return (
    <div className="space-y-3">
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">
          Brak dodanych umiejetnosci.
        </p>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              {...register(`skills.${index}.name`)}
              placeholder="np. React, Photoshop, MS Excel..."
              className={inputClass}
            />
            <select
              {...register(`skills.${index}.level`)}
              className="px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 cursor-pointer flex-shrink-0"
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append(newItem())}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all"
      >
        <Plus size={16} />
        Dodaj umiejetnosc
      </button>
    </div>
  )
}
