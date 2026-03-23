import { CvConfig } from './schema'

export interface CompletionResult {
  score: number       // 0-100
  filled: string[]    // completed items
  missing: string[]   // what's missing
}

export function calcCompletion(config: CvConfig): CompletionResult {
  const filled: string[] = []
  const missing: string[] = []

  // Personal — required (3 pts)
  if (config.personal.firstName && config.personal.lastName) filled.push('Imię i nazwisko')
  else missing.push('Imię i nazwisko')

  if (config.personal.email) filled.push('Adres e-mail')
  else missing.push('Adres e-mail')

  if (config.personal.phone) filled.push('Numer telefonu')
  else missing.push('Numer telefonu')

  // Personal — optional but valuable (3 pts)
  if (config.personal.city) filled.push('Miasto')
  else missing.push('Miasto zamieszkania')

  if (config.personal.photo) filled.push('Zdjęcie profilowe')
  else missing.push('Zdjęcie profilowe')

  if (config.personal.linkedin) filled.push('Profil LinkedIn')
  else missing.push('Profil LinkedIn')

  // Summary (2 pts)
  if (config.summary && config.summary.length >= 30) filled.push('Podsumowanie zawodowe')
  else missing.push('Podsumowanie zawodowe (min. 30 znaków)')

  // Experience (2 pts)
  if (config.experience.length >= 1) filled.push('Doświadczenie zawodowe')
  else missing.push('Co najmniej jedno doświadczenie')

  if (config.experience.length >= 2) filled.push('Drugie doświadczenie')
  else missing.push('Drugie doświadczenie lub projekt')

  // Education (1 pt)
  if (config.education.length >= 1) filled.push('Wykształcenie')
  else missing.push('Wykształcenie')

  // Skills (2 pts)
  if (config.skills.length >= 3) filled.push('Umiejętności (3+)')
  else missing.push(`Umiejętności (masz ${config.skills.length}, dodaj co najmniej 3)`)

  if (config.skills.length >= 6) filled.push('Rozbudowane umiejętności (6+)')
  else missing.push('Więcej umiejętności (6+)')

  // Languages (1 pt)
  if (config.languages.length >= 1) filled.push('Języki obce')
  else missing.push('Przynajmniej jeden język obcy')

  // Interests (1 pt)
  if (config.interests.length >= 3) filled.push('Zainteresowania')
  else missing.push('Zainteresowania (min. 3)')

  // Bonus: certificates or projects (1 pt)
  if (config.certificates.length > 0 || config.projects.length > 0) {
    filled.push('Certyfikaty lub projekty')
  } else {
    missing.push('Certyfikaty lub własne projekty (bonus)')
  }

  const total = filled.length + missing.length
  const score = Math.round((filled.length / total) * 100)

  return { score, filled, missing }
}
