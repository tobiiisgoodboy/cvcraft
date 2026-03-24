import { CvConfig } from './schema'

export const defaultCvConfig: CvConfig = {
  meta: {
    template: 'classic',
    accentColor: '#2563eb',
    bgColor: '#ffffff',
    textColor: '#111827',
    photoPosition: 'right',
    font: 'Helvetica',
    skillLayout: 'categories' as const,
    margins: 'normal' as const,
    gdprEnabled: false,
    gdprLanguage: 'pl' as const,
    gdprText: '',
    gdprCompany: '',
    sectionOrder: ['summary', 'experience', 'projects', 'education', 'certificates', 'awards', 'skills', 'languages', 'interests'],
  },
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    linkedin: '',
    website: '',
    photo: null,
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  interests: [],
  certificates: [],
  projects: [],
  awards: [],
}

export const STORAGE_KEY = 'cvcraft-config'
