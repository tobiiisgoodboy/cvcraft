'use client'

import { UseFormReturn, FieldError } from 'react-hook-form'
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
  'w-full px-3 py-2 text-sm text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white placeholder:text-gray-300'

function fieldClass(error?: FieldError) {
  if (error) {
    return inputClass + ' border border-red-500 ring-1 ring-red-500'
  }
  return inputClass + ' border border-gray-200'
}

export function SectionPersonal({ form }: Props) {
  const { register, setValue, watch, formState: { errors } } = form
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
        <Field label="Imie *">
          <input
            {...register('personal.firstName')}
            placeholder="Jan"
            className={fieldClass(errors.personal?.firstName)}
          />
          {errors.personal?.firstName && (
            <p className="text-xs text-red-500 mt-1">{errors.personal.firstName.message}</p>
          )}
        </Field>
        <Field label="Nazwisko *">
          <input
            {...register('personal.lastName')}
            placeholder="Kowalski"
            className={fieldClass(errors.personal?.lastName)}
          />
          {errors.personal?.lastName && (
            <p className="text-xs text-red-500 mt-1">{errors.personal.lastName.message}</p>
          )}
        </Field>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="E-mail *">
          <input
            {...register('personal.email')}
            type="email"
            placeholder="jan@kowalski.pl"
            className={fieldClass(errors.personal?.email)}
          />
          {errors.personal?.email && (
            <p className="text-xs text-red-500 mt-1">{errors.personal.email.message}</p>
          )}
        </Field>
        <Field label="Telefon *">
          <input
            {...register('personal.phone')}
            placeholder="+48 123 456 789"
            className={fieldClass(errors.personal?.phone)}
          />
          {errors.personal?.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.personal.phone.message}</p>
          )}
        </Field>
      </div>

      <Field label="Miasto">
        <input
          {...register('personal.city')}
          placeholder="Warszawa"
          className={fieldClass()}
        />
      </Field>

      <Field label="LinkedIn">
        <input
          {...register('personal.linkedin')}
          placeholder="linkedin.com/in/jankowalski"
          className={fieldClass()}
        />
      </Field>

      <Field label="Strona internetowa">
        <input
          {...register('personal.website')}
          placeholder="jankowalski.pl"
          className={fieldClass()}
        />
      </Field>
    </div>
  )
}
