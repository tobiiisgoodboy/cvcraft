'use client'

import React from 'react'
import { Page, View, Text, Image, StyleSheet, Link } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'
import { registerFonts, getFontFamily, getBoldFont, getItalicFont, CvFont } from '@/lib/fonts'
import { t, PdfLang } from '@/lib/pdfI18n'
import { IconMail, IconPhone, IconMapPin, IconLinkedIn, IconGlobe } from '@/lib/pdfIcons'

const GDPR_DEFAULT_PL = 'Wyrażam zgodę na przetwarzanie moich danych osobowych przez [firma] w celu prowadzenia rekrutacji na aplikowane przeze mnie stanowisko.'
const GDPR_DEFAULT_EN = 'I hereby consent to my personal data being processed by [firma] for the purpose of considering my application for the vacancy.'

interface Props { config: CvConfig; qrDataUrl?: string | null }

export function ClassicTemplate({ config, qrDataUrl }: Props) {
  registerFonts()
  const font = (config.meta.font ?? 'Helvetica') as CvFont
  const accent = config.meta.accentColor || '#2563eb'
  const bgColor = config.meta.bgColor || '#ffffff'
  const textColor = config.meta.textColor || '#111827'
  const photoPosition = config.meta.photoPosition ?? 'right'
  const skillLayout = config.meta.skillLayout ?? 'categories'
  const marginH = config.meta.margins === 'narrow' ? 28 : config.meta.margins === 'wide' ? 68 : 48
  const lang = (config.meta.pdfLanguage ?? 'pl') as PdfLang
  const { personal, summary, experience, education, skills, languages, interests, certificates, projects, awards } = config

  const boldExtra = font === 'Roboto' ? { fontWeight: 700 as const } : {}
  const italicExtra = font === 'Roboto' ? { fontStyle: 'italic' as const } : {}

  const styles = StyleSheet.create({
    page: { fontFamily: getFontFamily(font), fontSize: 10, color: textColor, backgroundColor: bgColor, paddingTop: 0, paddingBottom: 36, paddingHorizontal: 0 },
    topBar: { height: 5, backgroundColor: accent },
    content: { paddingHorizontal: marginH, paddingTop: 28 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    headerLeft: { flex: 1, paddingRight: 16 },
    name: { fontSize: 26, fontFamily: getBoldFont(font), ...boldExtra, color: textColor, marginBottom: 3, letterSpacing: -0.5 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 0, marginTop: 6 },
    contactItem: { fontSize: 8.5, color: '#6b7280' },
    contactSep: { fontSize: 8.5, color: '#d1d5db', marginHorizontal: 5 },
    photo: { width: 72, height: 88, borderRadius: 3 },
    sectionTitle: { fontSize: 8.5, fontFamily: getBoldFont(font), ...boldExtra, textTransform: 'uppercase', letterSpacing: 1.2, color: accent, marginBottom: 8, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    section: { marginBottom: 16 },
    expItem: { marginBottom: 10 },
    expRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    expPosition: { fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra, color: textColor },
    expDates: { fontSize: 8.5, color: '#9ca3af' },
    expCompany: { fontSize: 9, color: accent, marginBottom: 3, fontFamily: getItalicFont(font), ...italicExtra },
    expDesc: { fontSize: 8.5, lineHeight: 1.55, color: textColor, marginTop: 2 },
    eduItem: { marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
    eduLeft: { flex: 1 },
    eduSchool: { fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra, color: textColor },
    eduDegree: { fontSize: 9, color: '#6b7280', marginTop: 1 },
    eduDates: { fontSize: 8.5, color: '#9ca3af' },
    skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0 },
    skillItem: { width: '50%', marginBottom: 6, paddingRight: 12 },
    skillName: { fontSize: 9, color: textColor, marginBottom: 2 },
    skillBarBg: { flexDirection: 'row', gap: 2 },
    langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    langName: { fontFamily: getBoldFont(font), ...boldExtra, color: textColor },
    langLevel: { color: '#9ca3af' },
    interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    interestTag: { fontSize: 8.5, color: textColor, backgroundColor: '#f3f4f6', paddingVertical: 2.5, paddingHorizontal: 7, borderRadius: 10 },
    // skill layout: tags
    skillTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    // skill layout: dots — 2-column grid same as bars
    skillDotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0 },
    skillDotsItem: { width: '50%', marginBottom: 5, paddingRight: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
    // skill layout: list
    skillListItem: { marginBottom: 3 },
    // skill layout: categories
    skillCategoryHeader: { fontSize: 8.5, fontFamily: getBoldFont(font), ...boldExtra, color: accent, marginBottom: 4, marginTop: 8, borderBottomWidth: 0.5, borderBottomColor: accent, paddingBottom: 2 },
    skillCategoryTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 },
    // contact icons
    contactIcon: { fontSize: 8, color: '#9ca3af', marginRight: 2 },
    // gdpr footer
    gdprText: { fontSize: 6.5, color: '#9ca3af', textAlign: 'center', marginTop: 8, lineHeight: 1.4 },
  })

  function SkillBar({ level }: { level: string }) {
    const filled = level === 'basic' ? 1 : level === 'advanced' ? 3 : 2
    return (
      <View style={styles.skillBarBg}>
        {[1, 2, 3].map(i => (
          <View key={i} style={{ width: 20, height: 3, borderRadius: 2, backgroundColor: i <= filled ? accent : '#e5e7eb' }} />
        ))}
      </View>
    )
  }

  function renderSkills() {
    if (!skills.length) return null
    switch (skillLayout) {
      case 'bars':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('skills', lang)}</Text>
            <View style={styles.skillsGrid}>
              {skills.map(skill => (
                <View key={skill.id} style={styles.skillItem}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <SkillBar level={skill.level} />
                </View>
              ))}
            </View>
          </View>
        )
      case 'tags': {
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('skills', lang)}</Text>
            <View style={styles.skillTagsRow}>
              {skills.map(skill => (
                <Text key={skill.id} style={{ fontSize: 9, color: accent, backgroundColor: accent + '22', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 10 }}>
                  {skill.name}
                </Text>
              ))}
            </View>
          </View>
        )
      }
      case 'categories': {
        const grouped: Record<string, typeof skills> = {}
        const uncategorized: typeof skills = []
        for (const skill of skills) {
          const cat = skill.category?.trim() || ''
          if (cat) {
            grouped[cat] = grouped[cat] ? [...grouped[cat], skill] : [skill]
          } else {
            uncategorized.push(skill)
          }
        }
        const entries = Object.entries(grouped)
        if (uncategorized.length) entries.push([t('other', lang), uncategorized])
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('skills', lang)}</Text>
            {entries.map(([cat, catSkills]) => (
              <View key={cat}>
                <Text style={styles.skillCategoryHeader}>{cat}</Text>
                <View style={styles.skillCategoryTagsRow}>
                  {catSkills.map(skill => (
                    <Text key={skill.id} style={{ fontSize: 9, color: accent, backgroundColor: accent + '22', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 10 }}>
                      {skill.name}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )
      }
      case 'dots': {
        const dotCount: Record<string, number> = { basic: 1, medium: 2, advanced: 3 }
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('skills', lang)}</Text>
            <View style={styles.skillDotsGrid}>
              {skills.map(skill => {
                const filled = dotCount[skill.level] ?? 2
                return (
                  <View key={skill.id} style={styles.skillDotsItem}>
                    <Text style={{ fontSize: 9, color: textColor, flex: 1 }}>{skill.name}</Text>
                    <Text style={{ fontSize: 9, color: accent, letterSpacing: 1 }}>
                      {[1, 2, 3].map(i => i <= filled ? '\u25CF' : '\u25CB').join('')}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        )
      }
      case 'list': {
        const levelLabel: Record<string, string> = { basic: t('levelBasic', lang), medium: t('levelMedium', lang), advanced: t('levelAdvanced', lang) }
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('skills', lang)}</Text>
            {skills.map(skill => (
              <View key={skill.id} style={styles.skillListItem}>
                <Text style={{ fontSize: 9, color: textColor }}>{'\u2022'} {skill.name} ({levelLabel[skill.level] ?? skill.level})</Text>
              </View>
            ))}
          </View>
        )
      }
      default:
        return null
    }
  }

  function formatDate(start: string, end: string, current: boolean) {
    const s = start || ''
    const e = current ? t('currently', lang) : (end || '')
    if (!s && !e) return ''
    if (!s) return e
    if (!e) return s
    return `${s} \u2013 ${e}`
  }

  const DEFAULT_ORDER = ['summary', 'experience', 'projects', 'education', 'certificates', 'awards', 'skills', 'languages', 'interests']
  const sectionOrder = [...new Set(config.meta.sectionOrder && config.meta.sectionOrder.length > 0 ? config.meta.sectionOrder : DEFAULT_ORDER)]

  const contactItems = [
    personal.email ? { icon: <IconMail size={8} color="#9ca3af" />, content: <Text style={styles.contactItem}>{personal.email}</Text>, key: 'email' } : null,
    personal.phone ? { icon: <IconPhone size={8} color="#9ca3af" />, content: <Text style={styles.contactItem}>{personal.phone}</Text>, key: 'phone' } : null,
    personal.city ? { icon: <IconMapPin size={8} color="#9ca3af" />, content: <Text style={styles.contactItem}>{personal.city}</Text>, key: 'city' } : null,
    personal.linkedin ? { icon: <IconLinkedIn size={8} />, content: <Link src={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} style={styles.contactItem}>{personal.linkedin}</Link>, key: 'linkedin' } : null,
    personal.website ? { icon: <IconGlobe size={8} color="#9ca3af" />, content: <Link src={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} style={styles.contactItem}>{personal.website}</Link>, key: 'website' } : null,
  ].filter(Boolean) as Array<{ icon: React.ReactNode; content: React.ReactNode; key: string }>

  function gdprFooter() {
    if (!config.meta.gdprEnabled) return null
    const lang = config.meta.gdprLanguage ?? 'pl'
    let text = config.meta.gdprText?.trim() || (lang === 'pl' ? GDPR_DEFAULT_PL : GDPR_DEFAULT_EN)
    const company = config.meta.gdprCompany?.trim()
    if (company) text = text.replace('[firma]', company)
    return <Text style={styles.gdprText}>{text}</Text>
  }

  function renderSection(id: string): React.ReactNode {
    switch (id) {
      case 'summary':
        return summary ? (
          <View key="summary" style={styles.section}>
            <Text style={styles.sectionTitle}>{t('summary', lang)}</Text>
            <Text style={{ fontSize: 9.5, lineHeight: 1.6, color: textColor }}>{summary}</Text>
          </View>
        ) : null

      case 'experience':
        return experience.length > 0 ? (
          <View key="experience" style={styles.section}>
            <Text style={styles.sectionTitle}>{t('experience', lang)}</Text>
            {experience.map(exp => (
              <View key={exp.id} style={styles.expItem}>
                <View style={styles.expRow}>
                  <Text style={styles.expPosition}>{exp.position}</Text>
                  <Text style={styles.expDates}>{formatDate(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                <Text style={styles.expCompany}>{exp.company}</Text>
                {exp.description ? <Text style={styles.expDesc}>{exp.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null

      case 'projects':
        return projects.length > 0 ? (
          <View key="projects" style={styles.section}>
            <Text style={styles.sectionTitle}>{t('projects', lang)}</Text>
            {projects.map(proj => (
              <View key={proj.id} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra, color: textColor }}>{proj.name}</Text>
                  {proj.technologies ? (
                    <Text style={{ fontSize: 8.5, color: '#6b7280', fontFamily: getItalicFont(font), ...italicExtra }}>{proj.technologies}</Text>
                  ) : null}
                </View>
                {proj.description ? <Text style={{ fontSize: 8.5, lineHeight: 1.55, color: textColor, marginTop: 2 }}>{proj.description}</Text> : null}
                {proj.url ? (
                  <Link src={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} style={{ fontSize: 8.5, color: accent, marginTop: 2 }}>
                    {proj.url}
                  </Link>
                ) : null}
              </View>
            ))}
          </View>
        ) : null

      case 'education':
        return education.length > 0 ? (
          <View key="education" style={styles.section}>
            <Text style={styles.sectionTitle}>{t('education', lang)}</Text>
            {education.map(edu => (
              <View key={edu.id} style={styles.eduItem}>
                <View style={styles.eduLeft}>
                  <Text style={styles.eduSchool}>{edu.school}</Text>
                  <Text style={styles.eduDegree}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</Text>
                </View>
                <Text style={styles.eduDates}>{formatDate(edu.startDate, edu.endDate, false)}</Text>
              </View>
            ))}
          </View>
        ) : null

      case 'certificates':
        return certificates.length > 0 ? (
          <View key="certificates" style={styles.section}>
            <Text style={styles.sectionTitle}>{t('certificates', lang)}</Text>
            {certificates.map(cert => (
              <View key={cert.id} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra, color: textColor }}>{cert.name}</Text>
                  {cert.date ? <Text style={{ fontSize: 8.5, color: '#9ca3af' }}>{cert.date}</Text> : null}
                </View>
                {cert.issuer ? <Text style={{ fontSize: 9, color: accent, fontFamily: getItalicFont(font), ...italicExtra }}>{cert.issuer}</Text> : null}
                {cert.url ? (
                  <Link src={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`} style={{ fontSize: 8.5, color: accent, marginTop: 1 }}>
                    {cert.url}
                  </Link>
                ) : null}
              </View>
            ))}
          </View>
        ) : null

      case 'awards':
        return awards && awards.length > 0 ? (
          <View key="awards" style={styles.section}>
            <Text style={styles.sectionTitle}>{t('awards', lang)}</Text>
            {awards.map((award) => (
              <View key={award.id} style={styles.expItem}>
                <View style={styles.expRow}>
                  <Text style={styles.expPosition}>{award.title}</Text>
                  {award.date ? <Text style={styles.expDates}>{award.date}</Text> : null}
                </View>
                {award.issuer ? <Text style={styles.expCompany}>{award.issuer}</Text> : null}
                {award.description ? <Text style={styles.expDesc}>{award.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null

      case 'skills':
        return renderSkills()

      case 'languages':
        return languages.length > 0 ? (
          <View key="languages" style={styles.section}>
            <Text style={styles.sectionTitle}>{t('languages', lang)}</Text>
            <View style={styles.langRow}>
              {languages.map(lang => (
                <View key={lang.id} style={{ flexDirection: 'row', gap: 3 }}>
                  <Text style={styles.langName}>{lang.name}</Text>
                  {lang.level ? <Text style={styles.langLevel}>({lang.level})</Text> : null}
                </View>
              ))}
            </View>
          </View>
        ) : null

      case 'interests':
        return interests.length > 0 ? (
          <View key="interests" style={styles.section}>
            <Text style={styles.sectionTitle}>{t('interests', lang)}</Text>
            <View style={styles.interestRow}>
              {interests.map((interest, i) => (
                <Text key={i} style={styles.interestTag}>{interest}</Text>
              ))}
            </View>
          </View>
        ) : null

      default:
        return null
    }
  }

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.topBar} />
      <View style={styles.content}>
        <View style={styles.header}>
          {personal.photo && photoPosition === 'left' && (
            <Image src={personal.photo} style={[styles.photo, { marginRight: 16, marginLeft: 0 }]} />
          )}
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{personal.firstName} {personal.lastName}</Text>
            <View style={styles.contactRow}>
              {contactItems.map((c, i) => (
                <View key={c.key} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {i > 0 && <Text style={styles.contactSep}>{'\u2022'}</Text>}
                  <View style={{ marginRight: 3 }}>{c.icon}</View>
                  {c.content}
                </View>
              ))}
            </View>
          </View>
          {personal.photo && photoPosition === 'right' && (
            <Image src={personal.photo} style={styles.photo} />
          )}
          {!personal.photo && qrDataUrl && (
            <Image src={qrDataUrl} style={{ width: 52, height: 52, marginLeft: 12 }} />
          )}
          {personal.photo && qrDataUrl && (
            <Image src={qrDataUrl} style={{ width: 44, height: 44, marginLeft: 8, marginTop: 4 }} />
          )}
        </View>

        {sectionOrder.map(id => renderSection(id))}
        {gdprFooter()}
      </View>
    </Page>
  )
}
