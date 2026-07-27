'use client'

import { useState } from 'react'
import { UseFormReturn, useFieldArray, useController } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AutocompleteInput } from './AutocompleteInput'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  form: UseFormReturn<CvConfig>
}

const inputClass =
  'w-full px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-600'

const labelClass = 'text-sm font-semibold text-gray-800 dark:text-gray-200'

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

function PositionField({ form, index }: { form: UseFormReturn<CvConfig>; index: number }) {
  const { field } = useController({ control: form.control, name: `experience.${index}.position` })
  return (
    <AutocompleteInput
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      placeholder="Frontend Developer"
      className={inputClass}
    />
  )
}

function SortableExperienceItem({
  form,
  index,
  dragId,
  onRemove,
}: {
  form: UseFormReturn<CvConfig>
  index: number
  dragId: string
  onRemove: () => void
}) {
  const { register, watch } = form
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: dragId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  const current = watch(`experience.${index}.current`)
  const positionValue = watch(`experience.${index}.position`)
  const companyValue = watch(`experience.${index}.company`)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'border rounded-xl p-4 space-y-3 bg-gray-50/50 dark:bg-gray-800/50',
        isDragging
          ? 'border-blue-300 shadow-lg'
          : 'border-gray-200 dark:border-gray-700'
      )}
    >
      {/* Item header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
            title="Przeciągnij, aby zmienić kolejność"
          >
            <GripVertical size={16} />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
            title={collapsed ? 'Rozwiń pozycję' : 'Zwiń pozycję'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center gap-2 min-w-0 text-left"
          >
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide flex-shrink-0">
              Pozycja {index + 1}
            </span>
            {collapsed && (positionValue || companyValue) && (
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate normal-case">
                — {[positionValue, companyValue].filter(Boolean).join(', ')}
              </span>
            )}
          </button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
          title="Usuń pozycję"
        >
          <Trash2 size={14} />
          Usuń
        </button>
      </div>

      {!collapsed && (
      <>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Stanowisko</label>
          <PositionField form={form} index={index} />
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
          <label className={labelClass}>Data rozpoczęcia</label>
          <input
            {...register(`experience.${index}.startDate`)}
            placeholder="01/2020"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Data zakończenia</label>
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
        <span className="text-sm text-gray-600 dark:text-gray-400">Pracuję tu obecnie</span>
      </label>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>Opis obowiązków</label>
        <textarea
          {...register(`experience.${index}.description`)}
          rows={6}
          placeholder="Opisz swoje obowiązki, osiągnięcia i projekty..."
          className={cn(inputClass, 'resize-y min-h-[9rem] leading-relaxed')}
        />
      </div>
      </>
      )}
    </div>
  )
}

export function SectionExperience({ form }: Props) {
  const { control } = form
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'experience',
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = fields.findIndex((f) => f.id === active.id)
    const newIndex = fields.findIndex((f) => f.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex)
  }

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">
          Brak dodanych pozycji. Kliknij przycisk poniżej, aby dodać doświadczenie.
        </p>
      )}

      {fields.length > 1 && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Przeciągnij uchwyt <GripVertical size={12} className="inline align-text-bottom" /> aby zmienić kolejność pozycji.
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div
            className={cn(
              'space-y-4',
              fields.length > 2 && 'max-h-[70vh] overflow-y-auto pr-2'
            )}
          >
            {fields.map((field, index) => (
              <SortableExperienceItem
                key={field.id}
                dragId={field.id}
                form={form}
                index={index}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={() => append(newItem())}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-blue-300 dark:border-blue-500/50 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
      >
        <Plus size={16} />
        Dodaj kolejną pozycję
      </button>
    </div>
  )
}
