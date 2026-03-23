'use client'

import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dynamic from 'next/dynamic'
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Zap,
  Globe,
  Heart,
  Save,
  CheckCircle,
} from 'lucide-react'
import { CvConfig, CvConfigSchema } from '@/lib/schema'
import { defaultCvConfig, STORAGE_KEY } from '@/lib/defaults'
import { storage } from '@/lib/storage'
import { SectionPersonal } from './SectionPersonal'
import { SectionSummary } from './SectionSummary'
import { SectionExperience } from './SectionExperience'
import { SectionEducation } from './SectionEducation'
import { SectionSkills } from './SectionSkills'
import { SectionLanguages } from './SectionLanguages'
import { SectionInterests } from './SectionInterests'
import { ConfigControls } from '@/components/ConfigControls'
import { cn } from '@/lib/utils'

// Load PDF preview with ssr: false to avoid bundling @react-pdf/renderer on server
const PdfPreview = dynamic(
  () => import('@/components/pdf/PdfPreview').then((m) => m.PdfPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center flex-1 bg-gray-100 text-gray-400">
        <p className="text-sm">Ladowanie podgladu...</p>
      </div>
    ),
  }
)

const TABS = [
  { id: 'personal', label: 'Dane osobowe', icon: User },
  { id: 'summary', label: 'Podsumowanie', icon: FileText },
  { id: 'experience', label: 'Doswiadczenie', icon: Briefcase },
  { id: 'education', label: 'Wyksztalcenie', icon: GraduationCap },
  { id: 'skills', label: 'Umiejetnosci', icon: Zap },
  { id: 'languages', label: 'Jezyki', icon: Globe },
  { id: 'interests', label: 'Zainteresowania', icon: Heart },
]

type TabId = (typeof TABS)[number]['id']

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

function mergeWithDefaults(saved: unknown): CvConfig {
  const raw = (saved && typeof saved === 'object' ? saved : {}) as Record<string, unknown>
  return {
    meta: {
      template: ((raw.meta as Record<string, unknown>)?.template as CvConfig['meta']['template']) ?? 'classic',
      accentColor: ((raw.meta as Record<string, unknown>)?.accentColor as string) ?? '#2563eb',
    },
    personal: {
      firstName: ((raw.personal as Record<string, unknown>)?.firstName as string) ?? '',
      lastName: ((raw.personal as Record<string, unknown>)?.lastName as string) ?? '',
      email: ((raw.personal as Record<string, unknown>)?.email as string) ?? '',
      phone: ((raw.personal as Record<string, unknown>)?.phone as string) ?? '',
      city: ((raw.personal as Record<string, unknown>)?.city as string) ?? '',
      linkedin: ((raw.personal as Record<string, unknown>)?.linkedin as string) ?? '',
      website: ((raw.personal as Record<string, unknown>)?.website as string) ?? '',
      photo: ((raw.personal as Record<string, unknown>)?.photo as string | null) ?? null,
    },
    summary: (raw.summary as string) ?? '',
    experience: Array.isArray(raw.experience) ? raw.experience : [],
    education: Array.isArray(raw.education) ? raw.education : [],
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    languages: Array.isArray(raw.languages) ? raw.languages : [],
    interests: Array.isArray(raw.interests) ? raw.interests : [],
  }
}

export function EditorLayout() {
  const [activeTab, setActiveTab] = useState<TabId>('personal')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [previewConfig, setPreviewConfig] = useState<CvConfig>(defaultCvConfig)
  const [hydrated, setHydrated] = useState(false)

  const form = useForm<CvConfig>({
    resolver: zodResolver(CvConfigSchema),
    defaultValues: defaultCvConfig,
  })

  const { control, setValue, getValues, reset } = form
  const watchedValues = useWatch({ control })
  const debouncedValues = useDebounce(watchedValues, 500)

  // Load from localStorage on mount
  useEffect(() => {
    storage.load(STORAGE_KEY).then((saved) => {
      if (saved) {
        try {
          const merged = mergeWithDefaults(saved)
          reset(merged)
          setPreviewConfig(merged)
        } catch (e) {
          console.error('Failed to load saved config:', e)
        }
      }
      setHydrated(true)
    })
  }, [reset])

  // Auto-save on changes (debounced)
  useEffect(() => {
    if (!hydrated) return
    const data = getValues()
    setSaveStatus('saving')
    storage.save(STORAGE_KEY, data).then(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    })
  }, [debouncedValues, hydrated, getValues])

  // Update preview config with debounce
  useEffect(() => {
    if (!hydrated) return
    const data = getValues()
    setPreviewConfig(data as CvConfig)
  }, [debouncedValues, hydrated, getValues])

  function handleTemplateChange(template: 'classic' | 'modern' | 'minimal') {
    setValue('meta.template', template, { shouldDirty: true })
    setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, template } }))
  }

  function handleAccentColorChange(color: string) {
    setValue('meta.accentColor', color, { shouldDirty: true })
    setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, accentColor: color } }))
  }

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center flex-1 text-gray-400">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Ladowanie...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Editor Panel (left, 58%) */}
      <div className="flex flex-col w-[58%] border-r border-gray-200 overflow-hidden">
        {/* Tab bar */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white overflow-x-auto">
          <div className="flex">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap transition-all border-b-2',
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">
          <form>
            {activeTab === 'personal' && <SectionPersonal form={form} />}
            {activeTab === 'summary' && <SectionSummary form={form} />}
            {activeTab === 'experience' && <SectionExperience form={form} />}
            {activeTab === 'education' && <SectionEducation form={form} />}
            {activeTab === 'skills' && <SectionSkills form={form} />}
            {activeTab === 'languages' && <SectionLanguages form={form} />}
            {activeTab === 'interests' && <SectionInterests form={form} />}
          </form>
        </div>

        {/* Bottom bar */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-2.5 flex items-center justify-between">
          <ConfigControls form={form} />
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            {saveStatus === 'saving' && (
              <>
                <Save size={12} className="animate-pulse text-blue-500" />
                <span className="text-blue-500">Zapisywanie...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle size={12} className="text-green-500" />
                <span className="text-green-500">Zapisano</span>
              </>
            )}
            {saveStatus === 'idle' && (
              <span className="text-gray-300">Automatyczny zapis wlaczony</span>
            )}
          </div>
        </div>
      </div>

      {/* Preview Panel (right, 42%) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <PdfPreview
          config={previewConfig}
          onTemplateChange={handleTemplateChange}
          onAccentColorChange={handleAccentColorChange}
        />
      </div>
    </div>
  )
}
