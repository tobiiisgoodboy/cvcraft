export type PdfLang = 'pl' | 'en'

const strings: Record<string, Record<PdfLang, string>> = {
  summary:          { pl: 'Podsumowanie',           en: 'Summary' },
  about:            { pl: 'O mnie',                  en: 'About Me' },
  experience:       { pl: 'Doswiadczenie zawodowe',  en: 'Work Experience' },
  experienceShort:  { pl: 'Doswiadczenie',           en: 'Experience' },
  projects:         { pl: 'Projekty',                en: 'Projects' },
  education:        { pl: 'Wyksztalcenie',           en: 'Education' },
  certificates:     { pl: 'Certyfikaty i kursy',     en: 'Certificates & Courses' },
  awards:           { pl: 'Nagrody i wyroznienia',   en: 'Awards & Honors' },
  skills:           { pl: 'Umiejetnosci',            en: 'Skills' },
  languages:        { pl: 'Jezyki obce',             en: 'Languages' },
  languagesShort:   { pl: 'Jezyki',                  en: 'Languages' },
  interests:        { pl: 'Zainteresowania',         en: 'Interests' },
  contact:          { pl: 'Kontakt',                 en: 'Contact' },
  profile:          { pl: 'Profil',                  en: 'Profile' },
  currently:        { pl: 'obecnie',                 en: 'present' },
  other:            { pl: 'Inne',                    en: 'Other' },
  levelBasic:       { pl: 'Podstawowy',              en: 'Basic' },
  levelMedium:      { pl: 'Sredni',                  en: 'Intermediate' },
  levelAdvanced:    { pl: 'Zaawansowany',            en: 'Advanced' },
  levelBasicShort:  { pl: 'Podst.',                  en: 'Basic' },
  levelMediumShort: { pl: 'Sredni',                  en: 'Interm.' },
  levelAdvShort:    { pl: 'Zaaw.',                   en: 'Adv.' },
}

export function t(key: string, lang: PdfLang = 'pl'): string {
  return strings[key]?.[lang] ?? key
}
