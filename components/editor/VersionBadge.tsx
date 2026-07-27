'use client'

const ENV = process.env.NEXT_PUBLIC_DEPLOY_ENV || 'development'
const SHA = (process.env.NEXT_PUBLIC_COMMIT_SHA || 'dev').slice(0, 7)
const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || ''

const ENV_META: Record<string, { label: string; color: string }> = {
  production: { label: 'Produkcja', color: '#10b981' },
  preview: { label: 'Preview', color: '#f59e0b' },
  development: { label: 'Lokalnie', color: '#7c6aff' },
}

export function VersionBadge() {
  const meta = ENV_META[ENV] ?? ENV_META.development
  const buildLabel = BUILD_TIME
    ? new Date(BUILD_TIME).toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div
      className="px-3 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03]"
      title={`Wersja ${meta.label} • commit ${SHA}${buildLabel ? ` • build ${buildLabel}` : ''}`}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}` }}
        />
        <span className="text-[11px] font-semibold" style={{ color: meta.color }}>
          {meta.label}
        </span>
        <span className="text-[11px] text-gray-400 dark:text-white/40 font-mono ml-auto">
          #{SHA}
        </span>
      </div>
      {buildLabel && (
        <div className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5">build {buildLabel}</div>
      )}
    </div>
  )
}
