import { z } from 'zod'

export const MetaSchema = z.object({
  template: z.enum(['classic', 'modern', 'minimal']),
  accentColor: z.string(),
  bgColor: z.string(),
  textColor: z.string(),
  photoPosition: z.enum(['left', 'right', 'none']),
  font: z.enum(['Helvetica', 'Times-Roman', 'Roboto']),
  skillLayout: z.enum(['bars', 'tags', 'dots', 'list', 'categories']),
  sectionOrder: z.array(z.string()),
  gdprEnabled: z.boolean().optional(),
  gdprLanguage: z.enum(['pl', 'en']).optional(),
  gdprText: z.string().optional(),
  gdprCompany: z.string().optional(),
})

export const PersonalSchema = z.object({
  firstName: z.string().min(1, 'Pole wymagane'),
  lastName: z.string().min(1, 'Pole wymagane'),
  email: z.string().min(1, 'Pole wymagane'),
  phone: z.string().min(1, 'Pole wymagane'),
  city: z.string(),
  linkedin: z.string(),
  website: z.string(),
  photo: z.string().nullable(),
})

export const ExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  description: z.string(),
})

export const EducationItemSchema = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string(),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string(),
})

export const SkillItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.enum(['basic', 'medium', 'advanced']),
  category: z.string().optional(),
})

export const LanguageItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.string(),
})

export const CertificateItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  url: z.string(),
})

export const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string(),
  technologies: z.string(),
})

export const AwardItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.string(),
  date: z.string(),
  description: z.string(),
})

export const CvConfigSchema = z.object({
  meta: MetaSchema,
  personal: PersonalSchema,
  summary: z.string(),
  experience: z.array(ExperienceItemSchema),
  education: z.array(EducationItemSchema),
  skills: z.array(SkillItemSchema),
  languages: z.array(LanguageItemSchema),
  interests: z.array(z.string()),
  certificates: z.array(CertificateItemSchema),
  projects: z.array(ProjectItemSchema),
  awards: z.array(AwardItemSchema),
})

export type CvConfig = z.infer<typeof CvConfigSchema>
export type PersonalData = z.infer<typeof PersonalSchema>
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>
export type EducationItem = z.infer<typeof EducationItemSchema>
export type SkillItem = z.infer<typeof SkillItemSchema>
export type LanguageItem = z.infer<typeof LanguageItemSchema>
export type MetaData = z.infer<typeof MetaSchema>
export type CertificateItem = z.infer<typeof CertificateItemSchema>
export type ProjectItem = z.infer<typeof ProjectItemSchema>
export type AwardItem = z.infer<typeof AwardItemSchema>
