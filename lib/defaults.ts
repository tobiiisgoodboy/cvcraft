import { CvConfig } from './schema'

export const defaultCvConfig: CvConfig = {
  meta: {
    template: 'classic',
    accentColor: '#2563eb',
    photoPosition: 'right',
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
}

export const STORAGE_KEY = 'cvcraft-config'
