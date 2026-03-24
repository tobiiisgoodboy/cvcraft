import { CvConfig } from './schema'

/**
 * Rough page count estimate based on CV content.
 * Assumes A4 page with ~720px usable height at 72dpi.
 * Each "unit" is approximately 14px of content height.
 */
export function estimatePageCount(config: CvConfig): number {
  const MARGIN_UNITS = 10  // header + padding
  let units = MARGIN_UNITS

  if (config.personal.photo) units += 2

  if (config.summary) units += 2 + Math.ceil(config.summary.length / 120)

  for (const exp of config.experience) {
    units += 3
    if (exp.description) units += Math.ceil(exp.description.length / 100)
  }

  for (const proj of config.projects) {
    units += 2
    if (proj.description) units += Math.ceil(proj.description.length / 100)
  }

  units += config.education.length * 2
  units += config.certificates.length * 2
  units += config.awards.length * 2

  const skillRows = Math.ceil(config.skills.length / 2)
  units += skillRows + 2

  if (config.languages.length) units += 2
  if (config.interests.length) units += 2

  // ~51 units per page at normal density
  const pages = Math.max(1, Math.ceil(units / 51))
  return pages
}
