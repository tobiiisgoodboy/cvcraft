'use client'

import { useEffect, useMemo, useState } from 'react'
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

const PdfPreview = dynamic(
  () => import('@/components/pdf/PdfPreview').then((m) => m.PdfPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center flex-1 text-gray-400 dark:text-white/30">
        <p className="text-sm">Ladowanie podgladu...</p>
      </div>
    ),
  }
)

const STEPS = [
  { id: 'personal',     label: 'Dane osobowe',         icon: User,        group: 'PROFIL' },
  { id: 'summary',      label: 'Podsumowanie',          icon: FileText,    group: 'PROFIL' },
  { id: 'experience',   label: 'Doswiadczenie',         icon: Briefcase,   group: 'DOSWIADCZENIE' },
  { id: 'education',    label: 'Wyksztalcenie',         icon: GraduationCap, group: 'DOSWIADCZENIE' },
  { id: 'projects',     label: 'Projekty',              icon: FolderGit2,  group: 'DOSWIADCZENIE' },
  { id: 'skills',       label: 'Umiejetnosci',          icon: Zap,         group: 'KOMPETENCJE' },
  { id: 'languages',    label: 'Jezyki',                icon: Globe,       group: 'KOMPETENCJE' },
  { id: 'interests',    label: 'Zainteresowania',       icon: Heart,       group: 'KOMPETENCJE' },
  { id: 'certificates', label: 'Certyfikaty',           icon: Award,       group: 'DODATKI' },
  { id: 'awards',       label: 'Nagrody',               icon: Trophy,      group: 'DODATKI' },
  { id: 'order',        label: 'Kolejnosc sekcji',      icon: LayoutList,  group: null },
  { id: 'preview',      label: 'Podglad i pobieranie',  icon: Download,    group: null },
] as const

const STEP_SUBTITLES: Record<string, string> = {
  personal:     'Podstawowe informacje kontaktowe widoczne w naglowku',
  summary:      'Krotki opis Twojego profilu — pojawi sie pod naglowkiem',
  experience:   'Historia zatrudnienia od najnowszego do najstarszego',
  education:    'Ukonzone szkoly, kierunki i daty',
  skills:       'Kompetencje techniczne i miekkie — mozesz grupowac w kategorie',
  languages:    'Jezyki obce z poziomem CEFR',
  interests:    'Zainteresowania i hobby — pokaz kim jestes poza praca',
  certificates: 'Ukonzone kursy, licencje i certyfikaty branzowe',
  awards:       'Osiagniecia zawodowe i akademickie',
  projects:     'Projekty portfolio lub wlasne realizacje',
  order:        'Przeciagnij sekcje aby zmienic ich kolejnosc w PDF',
  preview:      'Podglad finalnego CV — pobierz lub zmien ustawienia szablonu',
}

// Sidebar group order
const SIDEBAR_GROUPS = ['PROFIL', 'DOSWIADCZENIE', 'KOMPETENCJE', 'DODATKI']

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
    case 'summary':      return vals.summary ? 'done' : 'empty'
    case 'experience':   return (vals.experience?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'education':    return (vals.education?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'skills':       return (vals.skills?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'languages':    return (vals.languages?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'interests':    return (vals.interests?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'certificates': return (vals.certificates?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'awards':       return (vals.awards?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'projects':     return (vals.projects?.length ?? 0) > 0 ? 'done' : 'empty'
    case 'order':        return 'done'
    default:             return 'empty'
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

  // Completion percentage based on done steps
  const completionPct = useMemo(() => {
    const editSteps = STEPS.filter((s) => s.id !== 'preview' && s.id !== 'order')
    const doneCount = editSteps.filter((s) => getStepStatus(watchedValues, s.id) === 'done').length
    return Math.round((doneCount / editSteps.length) * 100)
  }, [watchedValues])

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
  const editStepsCount = STEPS.length - 1
  const progressPct = activeStep === 'preview'
    ? 100
    : ((currentStepIdx + 1) / editStepsCount) * 100

  // Sidebar steps excluding preview
  const sidebarSteps = STEPS.filter((s) => s.id !== 'preview')
  const previewStep = STEPS[STEPS.length - 1]
  // Edit steps for bottom dots (exclude order + preview)
  const dotSteps = STEPS.filter((s) => s.id !== 'preview' && s.id !== 'order')

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center flex-1 text-gray-400 dark:text-white/30">
        <div className="text-center space-y-3">
          <div
            className="w-9 h-9 rounded-full mx-auto animate-spin"
            style={{ border: '2.5px solid rgba(124,106,255,0.2)', borderTopColor: '#7c6aff' }}
          />
          <p className="text-sm font-medium">Ladowanie...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* ── TOPBAR ───────────────────────────────────────────── */}
      <header
        className="flex-shrink-0 h-14 flex items-center gap-3 px-5 border-b border-black/[0.07] dark:border-white/[0.07] z-10"
        style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-[9px] flex items-center justify-center text-white font-bold text-sm"
            style={{
              fontFamily: 'var(--font-syne)',
              background: 'linear-gradient(135deg, #6c47ff, #06b6d4)',
              boxShadow: '0 4px 14px rgba(124,106,255,0.4)',
            }}
          >CV</div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-syne)',
              background: 'linear-gradient(90deg, #6c47ff, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >CVcraft</span>
        </div>

        <div className="flex-1" />

        {/* Autosave status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-white/30 flex-shrink-0">
          {saveStatus === 'saving' && (
            <>
              <Save size={12} className="animate-pulse" style={{ color: '#7c6aff' }} />
              <span style={{ color: '#7c6aff' }}>Zapisywanie...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <CheckCircle size={12} className="text-emerald-500" />
              <span className="text-emerald-500">Zapisano</span>
            </>
          )}
          {saveStatus === 'idle' && (
            <>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }}
              />
              Zapisano przed chwila
            </>
          )}
        </div>

        {/* Completion chip */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold flex-shrink-0"
          style={{ borderColor: 'rgba(0,0,0,0.10)', background: 'rgba(0,0,0,0.03)', color: '#5c5e78' }}
        >
          {/* Mini ring */}
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
            <circle cx="9" cy="9" r="7" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5" />
            <circle
              cx="9" cy="9" r="7" fill="none"
              stroke="url(#cg)" strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="43.98"
              strokeDashoffset={43.98 * (1 - completionPct / 100)}
              style={{ transition: 'stroke-dashoffset 0.6s' }}
            />
            <defs>
              <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6c47ff" />
                <stop offset="100%" stopColor="#06d6c7" />
              </linearGradient>
            </defs>
          </svg>
          Kompletnosc&nbsp;
          <span style={{ background: 'linear-gradient(90deg,#6c47ff,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {completionPct}%
          </span>
        </div>

        {/* Podglad PDF */}
        <button
          type="button"
          onClick={handleOpenPreview}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex-shrink-0"
          style={{ color: '#7c6aff', borderColor: 'rgba(124,106,255,0.3)', background: 'rgba(124,106,255,0.06)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,106,255,0.13)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(124,106,255,0.06)' }}
        >
          <Eye size={13} />
          Podglad PDF
        </button>

        {/* Pobierz PDF */}
        <button
          type="button"
          onClick={() => handleStepChange('preview')}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-lg flex-shrink-0 transition-all"
          style={{
            background: 'linear-gradient(135deg, #6c47ff, #7c6aff)',
            boxShadow: '0 4px 14px rgba(124,106,255,0.4)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)' }}
        >
          <Download size={13} />
          Pobierz PDF
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/70"
          style={{ borderColor: 'rgba(0,0,0,0.09)', background: 'rgba(0,0,0,0.03)' }}
          title={theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </header>

      {/* Dark mode topbar override */}
      <style>{`
        .dark header[data-topbar] {
          background: rgba(7,8,15,0.82) !important;
        }
      `}</style>

      {/* ── PROGRESS BAR ─────────────────────────────────────── */}
      <div className="flex-shrink-0 h-[3px] bg-black/[0.05] dark:bg-white/[0.06] overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #6c47ff, #06b6d4)',
          }}
        />
      </div>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR — flat list, same structure as mockup ────── */}
        <nav
          className="hidden md:flex flex-col w-[258px] flex-shrink-0 border-r border-black/[0.07] dark:border-white/[0.07] overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
          }}
        >
          {/* Top glow — same as mockup ::before */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{ background: 'linear-gradient(170deg, rgba(108,71,255,0.10) 0%, transparent 60%)' }}
            aria-hidden
          />

          {/* Flat scrollable list with padding+gap matching mockup exactly */}
          <div
            className="flex flex-col flex-1 overflow-y-auto relative z-[1]"
            style={{ padding: '20px 14px 8px', gap: 4 }}
          >
            {sidebarSteps.map((step) => {
              const status = getStepStatus(watchedValues, step.id)
              const isActive = activeStep === step.id
              const stepNumber = STEPS.findIndex((s) => s.id === step.id) + 1
              const prevStep = sidebarSteps[sidebarSteps.indexOf(step) - 1]
              const isGroupStart = !prevStep || prevStep.group !== step.group

              return (
                <>
                  {/* Section label — rendered inline when group changes */}
                  {isGroupStart && step.group && (
                    <div
                      key={`label-${step.group}`}
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(147,149,171,0.8)',
                        padding: '6px 10px 4px',
                        marginTop: stepNumber === 1 ? 0 : 8,
                      }}
                    >
                      {step.group}
                    </div>
                  )}
                  {/* Divider before order step */}
                  {step.id === 'order' && (
                    <div key="divider" style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '4px 0' }} />
                  )}
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepChange(step.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: isActive ? '1px solid rgba(124,106,255,0.35)' : '1px solid transparent',
                      fontSize: 14,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? '#14151f' : 'rgba(92,94,120,1)',
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(108,71,255,0.18), rgba(6,182,212,0.10))'
                        : 'transparent',
                      boxShadow: isActive ? '0 2px 16px rgba(108,71,255,0.12)' : 'none',
                      textAlign: 'left',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    {/* Step number badge */}
                    <div style={{
                      width: 22, height: 22,
                      borderRadius: 6,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700,
                      flexShrink: 0,
                      transition: 'all 0.18s',
                      background: isActive
                        ? 'linear-gradient(135deg, #6c47ff, #06b6d4)'
                        : status === 'done'
                        ? 'rgba(16,185,129,0.18)'
                        : 'rgba(0,0,0,0.06)',
                      color: isActive ? '#fff' : status === 'done' ? '#10b981' : 'rgba(92,94,120,0.7)',
                    }}>
                      {stepNumber}
                    </div>

                    {/* Label */}
                    <span style={{ flex: 1 }}>{step.label}</span>

                    {/* Status dot — flex-shrink:0 at end, same width for all = perfect alignment */}
                    <span style={{
                      width: 7, height: 7,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: isActive
                        ? '#7c6aff'
                        : status === 'done'
                        ? '#10b981'
                        : status === 'partial'
                        ? '#f59e0b'
                        : 'rgba(0,0,0,0.13)',
                      boxShadow: isActive ? '0 0 6px #7c6aff' : 'none',
                      transition: 'all 0.18s',
                    }} />
                  </button>
                </>
              )
            })}
          </div>

          {/* Preview step — pinned bottom */}
          <div className="border-t border-black/[0.07] dark:border-white/[0.07] p-2.5" style={{ position: 'relative', zIndex: 1 }}>
            <button
              type="button"
              onClick={() => handleStepChange(previewStep.id)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all text-[13px] font-semibold"
              style={activeStep === 'preview' ? {
                background: 'linear-gradient(135deg, #6c47ff, #7c6aff)',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(124,106,255,0.38)',
              } : {
                color: '#7c6aff',
                border: '1px solid rgba(124,106,255,0.22)',
                background: 'rgba(124,106,255,0.05)',
              }}
            >
              <Download size={14} className="flex-shrink-0" />
              <span className="flex-1 truncate">{previewStep.label}</span>
            </button>
          </div>
        </nav>

        {/* ── MAIN ─────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Form steps */}
          {activeStep !== 'preview' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-6">

              {/* Section header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2
                    className="text-gray-900 dark:text-white font-bold leading-tight"
                    style={{ fontFamily: 'var(--font-syne)', fontSize: 23, letterSpacing: '-0.4px' }}
                  >
                    {currentStep.label}
                  </h2>
                  {STEP_SUBTITLES[activeStep] && (
                    <p className="text-[13px] text-gray-500 dark:text-white/35 mt-1">
                      {STEP_SUBTITLES[activeStep]}
                    </p>
                  )}
                </div>
                <span
                  className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ml-4 mt-0.5"
                  style={{ background: 'rgba(0,0,0,0.05)', color: '#9395ab' }}
                >
                  {currentStepIdx + 1} / {STEPS.length}
                </span>
              </div>

              {/* Glass form card */}
              <div
                className="cv-editor relative rounded-2xl border border-black/[0.07] dark:border-white/[0.08] p-5 md:p-6 shadow-md"
                style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(16px)' }}
              >
                <form>
                  {activeStep === 'personal'     && <SectionPersonal     form={form} />}
                  {activeStep === 'summary'      && <SectionSummary      form={form} />}
                  {activeStep === 'experience'   && <SectionExperience   form={form} />}
                  {activeStep === 'education'    && <SectionEducation    form={form} />}
                  {activeStep === 'skills'       && <SectionSkills       form={form} />}
                  {activeStep === 'languages'    && <SectionLanguages    form={form} />}
                  {activeStep === 'interests'    && <SectionInterests    form={form} />}
                  {activeStep === 'certificates' && <SectionCertificates form={form} />}
                  {activeStep === 'awards'       && <SectionAwards       form={form} />}
                  {activeStep === 'projects'     && <SectionProjects     form={form} />}
                  {activeStep === 'order'        && <SectionOrder        form={form} />}
                </form>
              </div>
            </div>
          )}

          {/* Preview step */}
          {activeStep === 'preview' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div
                className="flex items-center justify-between px-5 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)' }}
              >
                <span className="text-xs text-gray-500 dark:text-white/40">
                  Podglad finalnego CV — pobierz lub zmien ustawienia szablonu
                </span>
                <button
                  type="button"
                  onClick={capturePreview}
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
                  style={{ color: '#7c6aff', background: 'rgba(124,106,255,0.07)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,106,255,0.13)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(124,106,255,0.07)' }}
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

          {/* ── BOTTOM NAV ───────────────────────────────────────── */}
          <div
            className="flex-shrink-0 border-t border-black/[0.06] dark:border-white/[0.06] px-4 py-2.5 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)' }}
          >
            {/* Prev */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirstStep}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex-shrink-0',
                isFirstStep
                  ? 'opacity-30 cursor-not-allowed border-transparent text-gray-400'
                  : 'border-black/[0.09] text-gray-600 dark:text-white/55 hover:border-[#7c6aff] hover:text-[#7c6aff]'
              )}
            >
              <ChevronLeft size={13} />
              Wstecz
            </button>

            {/* Navigation dots */}
            <div className="flex items-center gap-1">
              {dotSteps.map((step) => {
                const isActive = activeStep === step.id
                const status = getStepStatus(watchedValues, step.id)
                return (
                  <div
                    key={step.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleStepChange(step.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStepChange(step.id)}
                    title={step.label}
                    style={{
                      width: isActive ? 18 : 6,
                      height: 6,
                      borderRadius: 99,
                      flexShrink: 0,
                      transition: 'all 0.2s',
                      background: isActive
                        ? 'linear-gradient(90deg, #6c47ff, #06b6d4)'
                        : status === 'done'
                        ? '#10b981'
                        : 'rgba(0,0,0,0.13)',
                      cursor: 'pointer',
                    }}
                  />
                )
              })}
            </div>

            <div className="flex-1" />

            {/* Config / history / versions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <ConfigControls form={form} />
              <HistoryControls form={form} historyVersion={historyVersion} />
              <VersionsControls
                form={form}
                onVersionSwitch={handleVersionSwitch}
                versionsVersion={versionsVersion}
              />
            </div>

            {/* Autosave label */}
            <span className="hidden sm:block text-xs text-gray-400 dark:text-white/25 flex-shrink-0">
              Auto-zapis aktywny
            </span>

            {/* Next */}
            <button
              type="button"
              onClick={handleNext}
              disabled={isLastStep}
              className={cn(
                'flex items-center gap-1 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex-shrink-0',
                isLastStep
                  ? 'opacity-30 cursor-not-allowed text-gray-400 border border-transparent'
                  : 'text-white'
              )}
              style={!isLastStep ? {
                background: 'linear-gradient(135deg, #6c47ff, #7c6aff)',
                boxShadow: '0 4px 14px rgba(124,106,255,0.35)',
              } : {}}
              onMouseEnter={(e) => { if (!isLastStep) e.currentTarget.style.filter = 'brightness(1.08)' }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)' }}
            >
              Dalej
              <ChevronRight size={13} />
            </button>
          </div>

        </div>
      </div>

      {/* Preview slide-over */}
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
