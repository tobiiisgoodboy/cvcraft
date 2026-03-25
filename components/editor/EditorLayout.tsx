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
  Award,
  FolderGit2,
  LayoutList,
  Trophy,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react'
import { CvConfig, CvConfigSchema } from '@/lib/schema'
import { defaultCvConfig, STORAGE_KEY } from '@/lib/defaults'
import { pushHistory } from '@/lib/history'
import { updateActiveVersion } from '@/lib/versions'
import { CvFont } from '@/lib/fonts'
import { storage } from '@/lib/storage'
import { useTheme } from '@/lib/theme'
import { SectionPersonal } from './SectionPersonal'
import { SectionSummary } from './SectionSummary'
import { SectionExperience } from './SectionExperience'
import { SectionEducation } from './SectionEducation'
import { SectionSkills } from './SectionSkills'
import { SectionLanguages } from './SectionLanguages'
import { SectionInterests } from './SectionInterests'
import { SectionCertificates } from './SectionCertificates'
import { SectionProjects } from './SectionProjects'
import { SectionAwards } from './SectionAwards'
import { SectionOrder } from './SectionOrder'
import { ConfigControls } from '@/components/ConfigControls'
import { HistoryControls } from './HistoryControls'
import { VersionsControls } from './VersionsControls'
import { PreviewSlideOver } from './PreviewSlideOver'
import { cn } from '@/lib/utils'

// Load PDF preview client-side only
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

const STEPS = [
  { id: 'personal', label: 'Dane osobowe', icon: User },
  { id: 'summary', label: 'Podsumowanie', icon: FileText },
  { id: 'experience', label: 'Doswiadczenie', icon: Briefcase },
  { id: 'education', label: 'Wyksztalcenie', icon: GraduationCap },
  { id: 'skills', label: 'Umiejetnosci', icon: Zap },
  { id: 'languages', label: 'Jezyki', icon: Globe },
  { id: 'interests', label: 'Zainteresowania', icon: Heart },
  { id: 'certificates', label: 'Certyfikaty', icon: Award },
  { id: 'awards', label: 'Nagrody', icon: Trophy },
  { id: 'projects', label: 'Projekty', icon: FolderGit2 },
  { id: 'order', label: 'Kolejnosc', icon: LayoutList },
  { id: 'preview', label: 'Podglad i pobieranie', icon: Download },
] as const

type StepId = (typeof STEPS)[number]['id']

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getStepStatus(vals: any, stepId: string): 'done' | 'partial' | 'empty' {
  const p = vals.personal
  switch (stepId) {
    case 'personal':
      if (p?.firstName && p?.lastName && p?.email) return 'done'
      if (p?.firstName || p?.lastName) return 'partial'
      return 'empty'
    case 'summary': return vals.summary ? 'done' : 'empty'
    case 'experience': return (vals.experience?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'education': return (vals.education?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'skills': return (vals.skills?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'languages': return (vals.languages?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'interests': return (vals.interests?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'certificates': return (vals.certificates?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'awards': return (vals.awards?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'projects': return (vals.projects?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'order': return 'done'
    default: return 'empty'
  }
}

function mergeWithDefaults(saved: unknown): CvConfig {
  const raw = (saved && typeof saved === 'object' ? saved : {}) as Record<string, unknown>
  return {
    meta: {
      template: ((raw.meta as Record<string, unknown>)?.template as CvConfig['meta']['template']) ?? 'classic',
      accentColor: ((raw.meta as Record<string, unknown>)?.accentColor as string) ?? '#2563eb',
      photoPosition: ((raw.meta as Record<string, unknown>)?.photoPosition as CvConfig['meta']['photoPosition']) ?? 'right',
      sectionOrder: Array.isArray((raw.meta as Record<string, unknown>)?.sectionOrder)
        ? [...new Set((raw.meta as Record<string, unknown>).sectionOrder as string[])]
        : ['summary', 'experience', 'projects', 'education', 'certificates', 'awards', 'skills', 'languages', 'interests'],
      font: (((raw.meta as Record<string, unknown>)?.font) as CvFont) ?? 'Helvetica',
      bgColor: ((raw.meta as Record<string, unknown>)?.bgColor as string) ?? '#ffffff',
      textColor: ((raw.meta as Record<string, unknown>)?.textColor as string) ?? '#111827',
      skillLayout: (((raw.meta as Record<string, unknown>)?.skillLayout) as CvConfig['meta']['skillLayout']) ?? 'categories',
      margins: (((raw.meta as Record<string, unknown>)?.margins) as 'narrow' | 'normal' | 'wide') ?? 'normal',
      qrEnabled: ((raw.meta as Record<string, unknown>)?.qrEnabled as boolean) ?? false,
      qrTarget: (((raw.meta as Record<string, unknown>)?.qrTarget) as 'linkedin' | 'website') ?? 'linkedin',
      pdfLanguage: (((raw.meta as Record<string, unknown>)?.pdfLanguage) as 'pl' | 'en') ?? 'pl',
      gdprEnabled: ((raw.meta as Record<string, unknown>)?.gdprEnabled as boolean) ?? false,
      gdprLanguage: (((raw.meta as Record<string, unknown>)?.gdprLanguage) as 'pl' | 'en') ?? 'pl',
      gdprText: ((raw.meta as Record<string, unknown>)?.gdprText as string) ?? '',
      gdprCompany: ((raw.meta as Record<string, unknown>)?.gdprCompany as string) ?? '',
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
    certificates: Array.isArray(raw.certificates) ? raw.certificates : [],
    projects: Array.isArray(raw.projects) ? raw.projects : [],
    awards: Array.isArray(raw.awards) ? raw.awards : [],
  }
}

export function EditorLayout() {
  const { theme, toggle } = useTheme()
  const [activeStep, setActiveStep] = useState<StepId>('personal')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [historyVersion, setHistoryVersion] = useState(0)
  const [versionsVersion, setVersionsVersion] = useState(0)
  const [previewConfig, setPreviewConfig] = useState<CvConfig>(defaultCvConfig)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const form = useForm<CvConfig>({
    resolver: zodResolver(CvConfigSchema),
    defaultValues: defaultCvConfig,
    mode: 'onBlur',
  })

  const { control, setValue, getValues, reset } = form
  const watchedValues = useWatch({ control })
  const debouncedSave = useDebounce(watchedValues, 600)

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

  // Auto-save on changes (debounced 600ms)
  useEffect(() => {
    if (!hydrated) return
    const data = getValues()
    setSaveStatus('saving')
    storage.save(STORAGE_KEY, data).then(() => {
      pushHistory(data as CvConfig)
      updateActiveVersion(data as CvConfig)
      setHistoryVersion((v) => v + 1)
      setVersionsVersion((v) => v + 1)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    })
  }, [debouncedSave, hydrated, getValues])

  // Capture current form values as a preview snapshot
  function capturePreview() {
    setPreviewConfig(getValues() as CvConfig)
  }

  function handleOpenPreview() {
    capturePreview()
    setPreviewOpen(true)
  }

  function handleStepChange(stepId: StepId) {
    if (stepId === 'preview') capturePreview()
    setActiveStep(stepId)
  }

  function handleNext() {
    const idx = STEPS.findIndex((s) => s.id === activeStep)
    if (idx < STEPS.length - 1) handleStepChange(STEPS[idx + 1].id)
  }

  function handlePrev() {
    const idx = STEPS.findIndex((s) => s.id === activeStep)
    if (idx > 0) handleStepChange(STEPS[idx - 1].id)
  }

  function handleVersionSwitch(config: CvConfig) {
    setPreviewConfig(config)
  }

  // PDF meta handlers — update both form and previewConfig
  function handleTemplateChange(template: 'classic' | 'modern' | 'minimal') {
    setValue('meta.template', template, { shouldDirty: true })
    setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, template } }))
  }

  function handleAccentColorChange(color: string) {
    setValue('meta.accentColor', color, { shouldDirty: true })
    setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, accentColor: color } }))
  }

  function handlePhotoPositionChange(position: 'left' | 'right' | 'none') {
    setValue('meta.photoPosition', position, { shouldDirty: true })
    setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, photoPosition: position } }))
  }

  function handleFontChange(font: 'Helvetica' | 'Times-Roman' | 'Roboto') {
    setValue('meta.font', font, { shouldDirty: true })
    setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, font } }))
  }

  function handleBgColorChange(color: string) {
    setValue('meta.bgColor', color, { shouldDirty: true })
    setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, bgColor: color } }))
  }

  function handleTextColorChange(color: string) {
    setValue('meta.textColor', color, { shouldDirty: true })
    setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, textColor: color } }))
  }

  function handleSkillLayoutChange(layout: 'bars' | 'tags' | 'dots' | 'list' | 'categories') {
    setValue('meta.skillLayout', layout, { shouldDirty: true })
    setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, skillLayout: layout } }))
  }

  function handleMarginsChange(margins: 'narrow' | 'normal' | 'wide') {
    setValue('meta.margins', margins, { shouldDirty: true })
    setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, margins } }))
  }

  function handlePdfLanguageChange(lang: 'pl' | 'en') {
    setValue('meta.pdfLanguage', lang, { shouldDirty: true })
    setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, pdfLanguage: lang } }))
  }

  function handleQrChange(patch: Partial<{ enabled: boolean; target: 'linkedin' | 'website' }>) {
    if (patch.enabled !== undefined) {
      setValue('meta.qrEnabled', patch.enabled, { shouldDirty: true })
      setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, qrEnabled: patch.enabled } }))
    }
    if (patch.target !== undefined) {
      setValue('meta.qrTarget', patch.target, { shouldDirty: true })
      setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, qrTarget: patch.target } }))
    }
  }

  function handleGdprChange(patch: Partial<{ enabled: boolean; language: 'pl' | 'en'; text: string; company: string }>) {
    if (patch.enabled !== undefined) {
      setValue('meta.gdprEnabled', patch.enabled, { shouldDirty: true })
      setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, gdprEnabled: patch.enabled } }))
    }
    if (patch.language !== undefined) {
      setValue('meta.gdprLanguage', patch.language, { shouldDirty: true })
      setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, gdprLanguage: patch.language, gdprText: '' } }))
    }
    if (patch.text !== undefined) {
      setValue('meta.gdprText', patch.text, { shouldDirty: true })
      setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, gdprText: patch.text } }))
    }
    if (patch.company !== undefined) {
      setValue('meta.gdprCompany', patch.company, { shouldDirty: true })
      setPreviewConfig((prev) => ({ ...prev, meta: { ...prev.meta, gdprCompany: patch.company } }))
    }
  }

  const previewHandlers = {
    onTemplateChange: handleTemplateChange,
    onAccentColorChange: handleAccentColorChange,
    onPhotoPositionChange: handlePhotoPositionChange,
    onFontChange: handleFontChange,
    onBgColorChange: handleBgColorChange,
    onTextColorChange: handleTextColorChange,
    onSkillLayoutChange: handleSkillLayoutChange,
    onMarginsChange: handleMarginsChange,
    onPdfLanguageChange: handlePdfLanguageChange,
    onQrChange: handleQrChange,
    onGdprChange: handleGdprChange,
  }

  const currentStepIdx = STEPS.findIndex((s) => s.id === activeStep)
  const isFirstStep = currentStepIdx === 0
  const isLastStep = currentStepIdx === STEPS.length - 1
  const currentStep = STEPS[currentStepIdx]
  // Exclude 'preview' step from progress fraction
  const editStepsCount = STEPS.length - 1
  const progressPct = activeStep === 'preview'
    ? 100
    : ((currentStepIdx + 1) / editStepsCount) * 100

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center flex-1 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Ladowanie...</p>
        </div>
      </div>
    )
  }

  return (
    // Outer: full height, background for "margins" effect on wide screens
    <div className="flex flex-1 overflow-hidden justify-center bg-gray-100 dark:bg-gray-950">

      {/* Centered max-width container */}
      <div className="flex flex-col w-full max-w-6xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">

        {/* Step navigation bar */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 px-4 pt-2 pb-1">
          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirstStep}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all flex-shrink-0',
                isFirstStep
                  ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <ChevronLeft size={14} />
              Poprzedni
            </button>

            {/* Step label */}
            <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
              <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                {currentStepIdx + 1}/{STEPS.length}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {currentStep.label}
              </span>
            </div>

            {/* Preview button + Next */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleOpenPreview}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                <Eye size={13} />
                Podglad PDF
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLastStep}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all',
                  isLastStep
                    ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                Nastepny
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Step progress line */}
          <div className="mt-2 h-0.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Content area: sidebar + editor */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar — desktop only */}
          <nav className="hidden md:flex flex-col w-52 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30">
            {/* Regular edit steps */}
            <div className="flex flex-col flex-1 py-1 overflow-y-auto">
              {STEPS.filter((s) => s.id !== 'preview').map((step) => {
                const Icon = step.icon
                const status = getStepStatus(watchedValues, step.id)
                const isActive = activeStep === step.id
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepChange(step.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2.5 text-left transition-all border-r-2',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-500'
                        : 'text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    )}
                  >
                    <Icon size={14} className="flex-shrink-0" />
                    <span className="flex-1 text-xs truncate">{step.label}</span>
                    {status === 'done' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    )}
                    {status === 'partial' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    )}
                    {status === 'empty' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Preview step — pinned at bottom */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-1">
              {(() => {
                const step = STEPS[STEPS.length - 1]
                const Icon = step.icon
                const isActive = activeStep === step.id
                return (
                  <button
                    type="button"
                    onClick={() => handleStepChange(step.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2.5 text-left rounded-md transition-all',
                      isActive
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    )}
                  >
                    <Icon size={14} className="flex-shrink-0" />
                    <span className="flex-1 text-xs truncate">{step.label}</span>
                  </button>
                )
              })()}
            </div>
          </nav>

          {/* Main content area */}
          <div className="flex flex-col flex-1 overflow-hidden">

            {/* Form steps */}
            {activeStep !== 'preview' && (
              <div className="flex-1 overflow-y-auto p-5 bg-white dark:bg-gray-900">
                <form>
                  {activeStep === 'personal' && <SectionPersonal form={form} />}
                  {activeStep === 'summary' && <SectionSummary form={form} />}
                  {activeStep === 'experience' && <SectionExperience form={form} />}
                  {activeStep === 'education' && <SectionEducation form={form} />}
                  {activeStep === 'skills' && <SectionSkills form={form} />}
                  {activeStep === 'languages' && <SectionLanguages form={form} />}
                  {activeStep === 'interests' && <SectionInterests form={form} />}
                  {activeStep === 'certificates' && <SectionCertificates form={form} />}
                  {activeStep === 'awards' && <SectionAwards form={form} />}
                  {activeStep === 'projects' && <SectionProjects form={form} />}
                  {activeStep === 'order' && <SectionOrder form={form} />}
                </form>
              </div>
            )}

            {/* Final preview step */}
            {activeStep === 'preview' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Podglad finalnego CV — pobierz lub zmien ustawienia szablonu
                  </span>
                  <button
                    type="button"
                    onClick={capturePreview}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2.5 py-1.5 rounded-md transition-colors"
                  >
                    <RefreshCw size={12} />
                    Odswiez podglad
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <PdfPreview
                    config={previewConfig}
                    onBackToEdit={() => handleStepChange('order')}
                    {...previewHandlers}
                  />
                </div>
              </div>
            )}

            {/* Bottom bar */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-2 flex-shrink-0">
                <ConfigControls form={form} />
                <HistoryControls form={form} historyVersion={historyVersion} />
                <VersionsControls
                  form={form}
                  onVersionSwitch={handleVersionSwitch}
                  versionsVersion={versionsVersion}
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}
                >
                  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs flex-shrink-0">
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
                  <span className="text-gray-300 dark:text-gray-600">Automatyczny zapis wlaczony</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Preview slide-over — fixed, outside max-width container */}
      {previewOpen && (
        <PreviewSlideOver
          config={previewConfig}
          onClose={() => setPreviewOpen(false)}
          onRefresh={capturePreview}
          {...previewHandlers}
        />
      )}
    </div>
  )
}
