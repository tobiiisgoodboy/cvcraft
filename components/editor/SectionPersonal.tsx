'use client'

import { UseFormReturn } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'
import { PhotoUpload } from './PhotoUpload'
import { cn } from '@/lib/utils'

interface Props {
  form: UseFormReturn<CvConfig>
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white placeholder:text-gray-300'

export function SectionPersonal({ form }: Props) {
  const { register, setValue, watch } = form
  const photo = watch('personal.photo')

  return (
    <div className="space-y-4">
      {/* Photo */}
      <div className="pb-4 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-600 mb-3">Zdjecie</p>
        <PhotoUpload
          value={photo}
          onChange={(val) => setValue('personal.photo', val, { shouldDirty: true })}
        />
      </div>

      {/* Name */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Imie">
          <input
            {...register('personal.firstName')}
            placeholder="Jan"
            className={inputClass}
          />
        </Field>
        <Field label="Nazwisko">
          <input
            {...register('personal.lastName')}
            placeholder="Kowalski"
            className={inputClass}
          />
        </Field>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="E-mail">
          <input
            {...register('personal.email')}
            type="email"
            placeholder="jan@kowalski.pl"
            className={inputClass}
          />
        </Field>
        <Field label="Telefon">
          <input
            {...register('personal.phone')}
            placeholder="+48 123 456 789"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Miasto">
        <input
          {...register('personal.city')}
          placeholder="Warszawa"
          className={inputClass}
        />
      </Field>

      <Field label="LinkedIn">
        <input
          {...register('personal.linkedin')}
          placeholder="linkedin.com/in/jankowalski"
          className={inputClass}
        />
      </Field>

      <Field label="Strona internetowa">
        <input
          {...register('personal.website')}
          placeholder="jankowalski.pl"
          className={inputClass}
        />
      </Field>
    </div>
  )
}
