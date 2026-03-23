'use client'

import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  form: UseFormReturn<CvConfig>
}

const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white placeholder:text-gray-300'

const labelClass = 'text-xs font-medium text-gray-600'

function newItem() {
  return {
    id: crypto.randomUUID(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  }
}

export function SectionExperience({ form }: Props) {
  const { register, control, watch } = form
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'experience',
  })

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">
          Brak dodanych pozycji. Kliknij przycisk ponizej, aby dodac doswiadczenie.
        </p>
      )}

      {fields.map((field, index) => {
        const current = watch(`experience.${index}.current`)
        return (
          <div
            key={field.id}
            className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50"
          >
            {/* Item header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Pozycja {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => index > 0 && move(index, index - 1)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                  title="Przesun w gore"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => index < fields.length - 1 && move(index, index + 1)}
                  disabled={index === fields.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                  title="Przesun w dol"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-1"
                  title="Usun"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Stanowisko</label>
                <input
                  {...register(`experience.${index}.position`)}
                  placeholder="Frontend Developer"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Firma</label>
                <input
                  {...register(`experience.${index}.company`)}
                  placeholder="Nazwa firmy"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Data rozpoczecia</label>
                <input
                  {...register(`experience.${index}.startDate`)}
                  placeholder="01/2020"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Data zakonczenia</label>
                <input
                  {...register(`experience.${index}.endDate`)}
                  placeholder="12/2023"
                  disabled={current}
                  className={cn(inputClass, current && 'opacity-40 cursor-not-allowed')}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register(`experience.${index}.current`)}
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 accent-blue-600"
              />
              <span className="text-sm text-gray-600">Pracuje tu obecnie</span>
            </label>

            <div className="flex flex-col gap-1">
              <label className={labelClass}>Opis obowiazkow</label>
              <textarea
                {...register(`experience.${index}.description`)}
                rows={3}
                placeholder="Opisz swoje obowiazki, osiagniecia i projekty..."
                className={cn(inputClass, 'resize-none leading-relaxed')}
              />
            </div>
          </div>
        )
      })}

      <button
        type="button"
        onClick={() => append(newItem())}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all"
      >
        <Plus size={16} />
        Dodaj doswiadczenie
      </button>
    </div>
  )
}
