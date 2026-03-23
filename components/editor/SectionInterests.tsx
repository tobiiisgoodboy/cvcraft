'use client'

import { useState, KeyboardEvent } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'
import { X } from 'lucide-react'

interface Props {
  form: UseFormReturn<CvConfig>
}

export function SectionInterests({ form }: Props) {
  const { watch, setValue } = form
  const interests = watch('interests') ?? []
  const [inputValue, setInputValue] = useState('')

  function addInterest() {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    if (interests.includes(trimmed)) {
      setInputValue('')
      return
    }
    setValue('interests', [...interests, trimmed], { shouldDirty: true })
    setInputValue('')
  }

  function removeInterest(index: number) {
    setValue(
      'interests',
      interests.filter((_, i) => i !== index),
      { shouldDirty: true }
    )
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addInterest()
    } else if (e.key === 'Backspace' && inputValue === '' && interests.length > 0) {
      removeInterest(interests.length - 1)
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Wpisz zainteresowanie i nacisnij Enter, aby dodac.
      </p>

      {/* Tags display */}
      <div className="min-h-[48px] flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
        {interests.map((interest, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium"
          >
            {interest}
            <button
              type="button"
              onClick={() => removeInterest(i)}
              className="text-blue-500 hover:text-blue-800 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addInterest}
          placeholder={interests.length === 0 ? 'Fotografia, Muzyka, Sport...' : ''}
          className="flex-1 min-w-[120px] text-sm outline-none placeholder:text-gray-300 bg-transparent"
        />
      </div>

      {interests.length > 0 && (
        <p className="text-xs text-gray-400">{interests.length} zainteresowania dodane</p>
      )}
    </div>
  )
}
