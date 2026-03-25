'use client'

import { useMemo } from 'react'
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { CvConfig } from '@/lib/schema'

const SECTION_LABELS: Record<string, string> = {
  summary: 'Podsumowanie zawodowe',
  experience: 'Doswiadczenie zawodowe',
  projects: 'Projekty',
  education: 'Wyksztalcenie',
  certificates: 'Certyfikaty i kursy',
  skills: 'Umiejetnosci',
  languages: 'Jezyki obce',
  interests: 'Zainteresowania',
}

const DEFAULT_ORDER = ['summary', 'experience', 'projects', 'education', 'certificates', 'awards', 'skills', 'languages', 'interests']

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border rounded-lg select-none ${
        isDragging ? 'shadow-lg border-blue-300 z-50' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical size={16} />
      </button>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{SECTION_LABELS[id] ?? id}</span>
    </div>
  )
}

interface Props {
  form: UseFormReturn<CvConfig>
}

export function SectionOrder({ form }: Props) {
  const { watch, setValue } = form
  const rawOrder = watch('meta.sectionOrder')
  const order: string[] = useMemo(() => {
    const raw = Array.isArray(rawOrder) && rawOrder.length > 0 ? rawOrder : DEFAULT_ORDER
    return [...new Set(raw)]
  }, [rawOrder])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = order.indexOf(String(active.id))
    const newIndex = order.indexOf(String(over.id))
    const newOrder = arrayMove(order, oldIndex, newIndex)
    setValue('meta.sectionOrder', newOrder, { shouldDirty: true })
  }

  function resetOrder() {
    setValue('meta.sectionOrder', DEFAULT_ORDER, { shouldDirty: true })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Przeciagnij sekcje aby zmienic kolejnosc w wygenerowanym CV.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {order.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={resetOrder}
        className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 underline"
      >
        Przywroc domyslna kolejnosc
      </button>
    </div>
  )
}
