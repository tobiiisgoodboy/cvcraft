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

// Szablon "Programista" — jednokolumnowy, gesty, ATS-friendly.
// Tytuly sekcji z akcentowym kwadracikiem, ciasne odstepy (wiecej tresci na stronie).
export function DeveloperTemplate({ config, qrDataUrl }: Props) {
  registerFonts()
  const font = (config.meta.font ?? 'Helvetica') as CvFont
  const accent = config.meta.accentColor || '#2563eb'
  const bgColor = config.meta.bgColor || '#ffffff'
  const textColor = config.meta.textColor || '#111827'
  const photoPosition = config.meta.photoPosition ?? 'right'
  const photoScale = config.meta.photoScale ?? 1
  const photoFit = (config.meta.photoFit ?? 'cover') as 'cover' | 'contain'
  const fontScale = config.meta.fontScale ?? 1
  const fs = (n: number) => Math.round(n * fontScale * 100) / 100
  const skillLayout = config.meta.skillLayout ?? 'categories'
  const marginH = config.meta.margins === 'narrow' ? 26 : config.meta.margins === 'wide' ? 60 : 42
  const lang = (config.meta.pdfLanguage ?? 'pl') as PdfLang
  const { personal, summary, experience, education, skills, languages, interests, certificates, projects, awards } = config

  const boldExtra = font === 'Roboto' ? { fontWeight: 700 as const } : {}
  const italicExtra = font === 'Roboto' ? { fontStyle: 'italic' as const } : {}
  const muted = '#6b7280'
  const faint = '#9ca3af'

  const styles = StyleSheet.create({
    page: { fontFamily: getFontFamily(font), fontSize: 9, color: textColor, backgroundColor: bgColor, paddingTop: 30, paddingBottom: 34, paddingHorizontal: marginH },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    headerLeft: { flex: 1, paddingRight: 14 },
    name: { fontSize: 22, fontFamily: getBoldFont(font), ...boldExtra, color: textColor, letterSpacing: -0.4, marginBottom: 4 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
    contactCell: { flexDirection: 'row', alignItems: 'center', marginRight: 12, marginTop: 2 },
    contactItem: { fontSize: 8.5, color: muted },
    photo: { width: 66 * photoScale, height: 82 * photoScale, borderRadius: 3, objectFit: photoFit },
    headerRule: { height: 2, backgroundColor: accent, marginTop: 8, marginBottom: 14 },
    section: { marginBottom: 12 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
    sectionSquare: { width: 5, height: 5, backgroundColor: accent, marginRight: 6 },
    sectionTitle: { fontSize: 9, fontFamily: getBoldFont(font), ...boldExtra, textTransform: 'uppercase', letterSpacing: 1.4, color: textColor },
    sectionHairline: { flex: 1, height: 0.5, backgroundColor: '#e5e7eb', marginLeft: 8 },
    summaryText: { fontSize: 9, lineHeight: 1.55, color: textColor },
    expItem: { marginBottom: 9 },
    expRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    expPosition: { fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra, color: textColor },
    expDates: { fontSize: 8, color: faint },
    expCompany: { fontSize: 8.5, color: accent, marginBottom: 2, fontFamily: getItalicFont(font), ...italicExtra },
    expDesc: { fontSize: 8.5, lineHeight: 1.5, color: textColor, marginTop: 1 },
    eduItem: { marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between' },
    eduLeft: { flex: 1 },
    eduSchool: { fontSize: 9.5, fontFamily: getBoldFont(font), ...boldExtra, color: textColor },
    eduDegree: { fontSize: 8.5, color: muted, marginTop: 1 },
    eduDates: { fontSize: 8, color: faint },
    tag: { fontSize: 8.5, color: accent, backgroundColor: accent + '1e', paddingVertical: 2.5, paddingHorizontal: 7, borderRadius: 3, marginRight: 4, marginBottom: 4 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap' },
    catHeader: { fontSize: 8.5, fontFamily: getBoldFont(font), ...boldExtra, color: muted, marginBottom: 3, marginTop: 5 },
    langRow: { flexDirection: 'row', flexWrap: 'wrap' },
    langCell: { flexDirection: 'row', marginRight: 16, marginBottom: 3 },
    langName: { fontSize: 9, fontFamily: getBoldFont(font), ...boldExtra, color: textColor },
    langLevel: { fontSize: 9, color: faint, marginLeft: 3 },
    interestTag: { fontSize: 8.5, color: textColor, backgroundColor: '#f3f4f6', paddingVertical: 2.5, paddingHorizontal: 7, borderRadius: 3, marginRight: 4, marginBottom: 4 },
    gdprText: { fontSize: 6.5, color: faint, textAlign: 'center', marginTop: 10, lineHeight: 1.4 },
  })

  if (fontScale !== 1) {
    for (const key of Object.keys(styles)) {
      const s = (styles as unknown as Record<string, { fontSize?: number }>)[key]
      if (typeof s.fontSize === 'number') s.fontSize = Math.round(s.fontSize * fontScale * 100) / 100
    }
  }

  function SectionTitle({ label }: { label: string }) {
    return (
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionSquare} />
        <Text style={styles.sectionTitle}>{label}</Text>
        <View style={styles.sectionHairline} />
      </View>
    )
  }

  function renderSkills() {
    if (!skills.length) return null
    switch (skillLayout) {
      case 'list': {
        const levelLabel: Record<string, string> = { basic: t('levelBasic', lang), medium: t('levelMedium', lang), advanced: t('levelAdvanced', lang) }
        return (
          <View style={styles.section}>
            <SectionTitle label={t('skills', lang)} />
            {skills.map(skill => (
              <Text key={skill.id} style={{ fontSize: fs(8.5), color: textColor, marginBottom: 2 }}>
                {'\u203A'} {skill.name} <Text style={{ color: faint }}>({levelLabel[skill.level] ?? skill.level})</Text>
              </Text>
            ))}
          </View>
        )
      }
      case 'categories': {
        const grouped: Record<string, typeof skills> = {}
        const uncategorized: typeof skills = []
        for (const skill of skills) {
          const cat = skill.category?.trim() || ''
          if (cat) grouped[cat] = grouped[cat] ? [...grouped[cat], skill] : [skill]
          else uncategorized.push(skill)
        }
        const entries = Object.entries(grouped)
        if (uncategorized.length) entries.push([t('other', lang), uncategorized])
        return (
          <View style={styles.section}>
            <SectionTitle label={t('skills', lang)} />
            {entries.map(([cat, catSkills]) => (
              <View key={cat}>
                <Text style={styles.catHeader}>{cat}</Text>
                <View style={styles.tagsRow}>
                  {catSkills.map(skill => (
                    <Text key={skill.id} style={styles.tag}>{skill.name}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )
      }
      default: {
        // tags / bars / dots -> ujednolicony blok tagow (developer = keywordy)
        return (
          <View style={styles.section}>
            <SectionTitle label={t('skills', lang)} />
            <View style={styles.tagsRow}>
              {skills.map(skill => (
                <Text key={skill.id} style={styles.tag}>{skill.name}</Text>
              ))}
            </View>
          </View>
        )
      }
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
    personal.email ? { icon: <IconMail size={8} color={faint} />, content: <Text style={styles.contactItem}>{personal.email}</Text>, key: 'email' } : null,
    personal.phone ? { icon: <IconPhone size={8} color={faint} />, content: <Text style={styles.contactItem}>{personal.phone}</Text>, key: 'phone' } : null,
    personal.city ? { icon: <IconMapPin size={8} color={faint} />, content: <Text style={styles.contactItem}>{personal.city}</Text>, key: 'city' } : null,
    personal.linkedin ? { icon: <IconLinkedIn size={8} />, content: <Link src={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} style={styles.contactItem}>{personal.linkedin}</Link>, key: 'linkedin' } : null,
    personal.website ? { icon: <IconGlobe size={8} color={faint} />, content: <Link src={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} style={styles.contactItem}>{personal.website}</Link>, key: 'website' } : null,
  ].filter(Boolean) as Array<{ icon: React.ReactNode; content: React.ReactNode; key: string }>

  function gdprFooter() {
    if (!config.meta.gdprEnabled) return null
    const gLang = config.meta.gdprLanguage ?? 'pl'
    let text = config.meta.gdprText?.trim() || (gLang === 'pl' ? GDPR_DEFAULT_PL : GDPR_DEFAULT_EN)
    const company = config.meta.gdprCompany?.trim()
    if (company) text = text.replace('[firma]', company)
    return <Text style={styles.gdprText}>{text}</Text>
  }

  function renderSection(id: string): React.ReactNode {
    switch (id) {
      case 'summary':
        return summary ? (
          <View key="summary" style={styles.section}>
            <SectionTitle label={t('summary', lang)} />
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null

      case 'experience':
        return experience.length > 0 ? (
          <View key="experience" style={styles.section}>
            <SectionTitle label={t('experience', lang)} />
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
            <SectionTitle label={t('projects', lang)} />
            {projects.map(proj => (
              <View key={proj.id} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: fs(10), fontFamily: getBoldFont(font), ...boldExtra, color: textColor }}>{proj.name}</Text>
                  {proj.technologies ? (
                    <Text style={{ fontSize: fs(8), color: muted, fontFamily: getItalicFont(font), ...italicExtra }}>{proj.technologies}</Text>
                  ) : null}
                </View>
                {proj.description ? <Text style={{ fontSize: fs(8.5), lineHeight: 1.5, color: textColor, marginTop: 1 }}>{proj.description}</Text> : null}
                {proj.url ? (
                  <Link src={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} style={{ fontSize: fs(8), color: accent, marginTop: 1 }}>
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
            <SectionTitle label={t('education', lang)} />
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
            <SectionTitle label={t('certificates', lang)} />
            {certificates.map(cert => (
              <View key={cert.id} style={{ marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: fs(9.5), fontFamily: getBoldFont(font), ...boldExtra, color: textColor }}>{cert.name}</Text>
                  {cert.date ? <Text style={{ fontSize: fs(8), color: faint }}>{cert.date}</Text> : null}
                </View>
                {cert.issuer ? <Text style={{ fontSize: fs(8.5), color: accent, fontFamily: getItalicFont(font), ...italicExtra }}>{cert.issuer}</Text> : null}
                {cert.url ? (
                  <Link src={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`} style={{ fontSize: fs(8), color: accent, marginTop: 1 }}>
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
            <SectionTitle label={t('awards', lang)} />
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
        return <View key="skills">{renderSkills()}</View>

      case 'languages':
        return languages.length > 0 ? (
          <View key="languages" style={styles.section}>
            <SectionTitle label={t('languages', lang)} />
            <View style={styles.langRow}>
              {languages.map(l => (
                <View key={l.id} style={styles.langCell}>
                  <Text style={styles.langName}>{l.name}</Text>
                  {l.level ? <Text style={styles.langLevel}>({l.level})</Text> : null}
                </View>
              ))}
            </View>
          </View>
        ) : null

      case 'interests':
        return interests.length > 0 ? (
          <View key="interests" style={styles.section}>
            <SectionTitle label={t('interests', lang)} />
            <View style={styles.tagsRow}>
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
      <View style={styles.header}>
        {personal.photo && photoPosition === 'left' && (
          <Image src={personal.photo} style={[styles.photo, { marginRight: 14 }]} />
        )}
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{personal.firstName} {personal.lastName}</Text>
          <View style={styles.contactRow}>
            {contactItems.map((c) => (
              <View key={c.key} style={styles.contactCell}>
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
          <Image src={qrDataUrl} style={{ width: 50, height: 50, marginLeft: 12 }} />
        )}
        {personal.photo && qrDataUrl && (
          <Image src={qrDataUrl} style={{ width: 42, height: 42, marginLeft: 8, marginTop: 4 }} />
        )}
      </View>
      <View style={styles.headerRule} />

      {sectionOrder.map(id => renderSection(id))}
      {gdprFooter()}
    </Page>
  )
}
