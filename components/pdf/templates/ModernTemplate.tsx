'use client'

import React from 'react'
import { Page, View, Text, Image, StyleSheet, Link } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'
import { registerFonts, getFontFamily, getBoldFont, getItalicFont, CvFont } from '@/lib/fonts'

const GDPR_DEFAULT_PL = 'Wyrażam zgodę na przetwarzanie moich danych osobowych przez [firma] w celu prowadzenia rekrutacji na aplikowane przeze mnie stanowisko.'
const GDPR_DEFAULT_EN = 'I hereby consent to my personal data being processed by [firma] for the purpose of considering my application for the vacancy.'

interface Props { config: CvConfig }

export function ModernTemplate({ config }: Props) {
  registerFonts()
  const font = (config.meta.font ?? 'Helvetica') as CvFont
  const accent = config.meta.accentColor || '#2563eb'
  const bgColor = config.meta.bgColor || '#ffffff'
  const textColor = config.meta.textColor || '#111827'
  const photoPosition = config.meta.photoPosition ?? 'right'
  const skillLayout = config.meta.skillLayout ?? 'bars'
  const { personal, summary, experience, education, skills, languages, interests, certificates, projects, awards } = config

  const boldExtra = font === 'Roboto' ? { fontWeight: 700 as const } : {}
  const italicExtra = font === 'Roboto' ? { fontStyle: 'italic' as const } : {}

  const styles = StyleSheet.create({
    page: { fontFamily: getFontFamily(font), fontSize: 10, flexDirection: 'row', backgroundColor: bgColor },
    sidebar: { width: '32%', backgroundColor: accent, minHeight: '100%', paddingBottom: 36 },
    sidebarPhoto: { width: '100%', height: 130 },
    sidebarContent: { paddingHorizontal: 18, paddingTop: 16 },
    sidebarName: { fontSize: 16, fontFamily: getBoldFont(font), ...boldExtra, color: '#ffffff', marginBottom: 3, lineHeight: 1.2 },
    sidebarSection: { marginTop: 18 },
    sidebarSectionTitle: { fontSize: 8, fontFamily: getBoldFont(font), ...boldExtra, textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)', marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.25)' },
    sidebarText: { fontSize: 8.5, color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
    sidebarSkillItem: { marginBottom: 7 },
    sidebarSkillName: { fontSize: 8.5, color: '#ffffff', marginBottom: 2.5 },
    sidebarBarBg: { backgroundColor: 'rgba(255,255,255,0.25)', height: 3, borderRadius: 2, width: '100%' },
    main: { flex: 1, paddingHorizontal: 28, paddingTop: 32, paddingBottom: 36 },
    mainSection: { marginBottom: 16 },
    mainSectionTitle: { fontSize: 9, fontFamily: getBoldFont(font), ...boldExtra, textTransform: 'uppercase', letterSpacing: 1, color: '#374151', marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1.5, borderBottomColor: accent },
    expItem: { marginBottom: 10, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#e5e7eb' },
    expPosition: { fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra, color: textColor },
    expCompany: { fontSize: 8.5, color: accent, fontFamily: getItalicFont(font), ...italicExtra, marginBottom: 2 },
    expDates: { fontSize: 8, color: '#9ca3af' },
    expDesc: { fontSize: 8.5, lineHeight: 1.55, color: textColor, marginTop: 3 },
    eduItem: { marginBottom: 8 },
    eduSchool: { fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra, color: textColor },
    eduDegree: { fontSize: 9, color: '#6b7280' },
    eduDates: { fontSize: 8, color: '#9ca3af' },
    interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
    interestTag: { fontSize: 8.5, color: accent, backgroundColor: '#eff6ff', paddingVertical: 2.5, paddingHorizontal: 7, borderRadius: 10, borderWidth: 1, borderColor: '#bfdbfe' },
    // sidebar skill tags
    sidebarTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    // sidebar skill dots row
    sidebarDotsItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 6 },
    // sidebar categories
    sidebarCategoryHeader: { fontSize: 7.5, fontFamily: getBoldFont(font), ...boldExtra, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 6, marginBottom: 3 },
    sidebarCategoryTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 },
    // gdpr footer
    gdprText: { fontSize: 6.5, color: '#9ca3af', textAlign: 'center', marginTop: 8, lineHeight: 1.4 },
  })

  function SidebarSkillBar({ level }: { level: string }) {
    const pct = level === 'basic' ? '33%' : level === 'advanced' ? '100%' : '66%'
    return (
      <View style={styles.sidebarBarBg}>
        <View style={{ backgroundColor: '#ffffff', height: 3, borderRadius: 2, width: pct }} />
      </View>
    )
  }

  function renderSidebarSkills() {
    if (!skills.length) return null
    switch (skillLayout) {
      case 'bars':
        return (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Umiejetnosci</Text>
            {skills.map(skill => (
              <View key={skill.id} style={styles.sidebarSkillItem}>
                <Text style={styles.sidebarSkillName}>{skill.name}</Text>
                <SidebarSkillBar level={skill.level} />
              </View>
            ))}
          </View>
        )
      case 'tags': {
        return (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Umiejetnosci</Text>
            <View style={styles.sidebarTagsRow}>
              {skills.map(skill => (
                <Text key={skill.id} style={{ fontSize: 8.5, color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.25)', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 8, marginBottom: 4 }}>
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
        if (uncategorized.length) entries.push(['Inne', uncategorized])
        return (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Umiejetnosci</Text>
            {entries.map(([cat, catSkills]) => (
              <View key={cat}>
                <Text style={styles.sidebarCategoryHeader}>{cat}</Text>
                <View style={styles.sidebarCategoryTagsRow}>
                  {catSkills.map(skill => (
                    <Text key={skill.id} style={{ fontSize: 8.5, color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.25)', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 8, marginBottom: 4 }}>
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
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Umiejetnosci</Text>
            {skills.map(skill => {
              const filled = dotCount[skill.level] ?? 2
              return (
                <View key={skill.id} style={styles.sidebarDotsItem}>
                  <Text style={{ fontSize: 8.5, color: '#ffffff', flex: 1 }}>{skill.name}</Text>
                  <Text style={{ fontSize: 8.5, color: '#ffffff', letterSpacing: 1 }}>
                    {[1, 2, 3].map(i => i <= filled ? '\u25CF' : '\u25CB').join('')}
                  </Text>
                </View>
              )
            })}
          </View>
        )
      }
      case 'list': {
        const levelLabel: Record<string, string> = { basic: 'Podst.', medium: 'Sredni', advanced: 'Zaaw.' }
        return (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Umiejetnosci</Text>
            {skills.map(skill => (
              <Text key={skill.id} style={[styles.sidebarText, { marginBottom: 3 }]}>
                {'\u2022'} {skill.name} ({levelLabel[skill.level] ?? skill.level})
              </Text>
            ))}
          </View>
        )
      }
      default:
        return null
    }
  }

  function gdprFooter() {
    if (!config.meta.gdprEnabled) return null
    const lang = config.meta.gdprLanguage ?? 'pl'
    let text = config.meta.gdprText?.trim() || (lang === 'pl' ? GDPR_DEFAULT_PL : GDPR_DEFAULT_EN)
    const company = config.meta.gdprCompany?.trim()
    if (company) text = text.replace('[firma]', company)
    return <Text style={styles.gdprText}>{text}</Text>
  }

  function formatDate(start: string, end: string, current: boolean) {
    const s = start || ''
    const e = current ? 'obecnie' : (end || '')
    if (!s && !e) return ''
    if (!s) return e
    if (!e) return s
    return `${s} \u2013 ${e}`
  }

  const DEFAULT_ORDER = ['summary', 'experience', 'projects', 'education', 'certificates', 'awards', 'skills', 'languages', 'interests']
  // In ModernTemplate, skills and languages are in the sidebar; only remaining sections go in main column
  const MAIN_SECTIONS = ['summary', 'experience', 'projects', 'education', 'certificates', 'awards', 'interests']
  const rawOrder = config.meta.sectionOrder && config.meta.sectionOrder.length > 0 ? config.meta.sectionOrder : DEFAULT_ORDER
  const sectionOrder = rawOrder.filter(id => MAIN_SECTIONS.includes(id))

  function renderSection(id: string): React.ReactNode {
    switch (id) {
      case 'summary':
        return summary ? (
          <View key="summary" style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Podsumowanie</Text>
            <Text style={{ fontSize: 9.5, lineHeight: 1.6, color: textColor }}>{summary}</Text>
          </View>
        ) : null

      case 'experience':
        return experience.length > 0 ? (
          <View key="experience" style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Doswiadczenie zawodowe</Text>
            {experience.map(exp => (
              <View key={exp.id} style={styles.expItem}>
                <Text style={styles.expPosition}>{exp.position}</Text>
                <Text style={styles.expCompany}>{exp.company}</Text>
                <Text style={styles.expDates}>{formatDate(exp.startDate, exp.endDate, exp.current)}</Text>
                {exp.description ? <Text style={styles.expDesc}>{exp.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null

      case 'projects':
        return projects.length > 0 ? (
          <View key="projects" style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Projekty</Text>
            {projects.map(proj => (
              <View key={proj.id} style={{ marginBottom: 10, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#e5e7eb' }}>
                <Text style={{ fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra, color: textColor }}>{proj.name}</Text>
                {proj.technologies ? (
                  <Text style={{ fontSize: 8.5, color: accent, fontFamily: getItalicFont(font), ...italicExtra, marginBottom: 2 }}>{proj.technologies}</Text>
                ) : null}
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
          <View key="education" style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Wyksztalcenie</Text>
            {education.map(edu => (
              <View key={edu.id} style={styles.eduItem}>
                <Text style={styles.eduSchool}>{edu.school}</Text>
                <Text style={styles.eduDegree}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</Text>
                <Text style={styles.eduDates}>{formatDate(edu.startDate, edu.endDate, false)}</Text>
              </View>
            ))}
          </View>
        ) : null

      case 'certificates':
        return certificates.length > 0 ? (
          <View key="certificates" style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Certyfikaty i kursy</Text>
            {certificates.map(cert => (
              <View key={cert.id} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra, color: textColor }}>{cert.name}</Text>
                  {cert.date ? <Text style={{ fontSize: 8, color: '#9ca3af' }}>{cert.date}</Text> : null}
                </View>
                {cert.issuer ? <Text style={{ fontSize: 8.5, color: accent, fontFamily: getItalicFont(font), ...italicExtra }}>{cert.issuer}</Text> : null}
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
          <View key="awards" style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Nagrody i wyroznienia</Text>
            {awards.map((award) => (
              <View key={award.id} style={styles.expItem}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={styles.expPosition}>{award.title}</Text>
                  {award.date ? <Text style={styles.expDates}>{award.date}</Text> : null}
                </View>
                {award.issuer ? <Text style={styles.expCompany}>{award.issuer}</Text> : null}
                {award.description ? <Text style={styles.expDesc}>{award.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null

      case 'interests':
        return interests.length > 0 ? (
          <View key="interests" style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Zainteresowania</Text>
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
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {photoPosition !== 'none' && personal.photo
          ? <Image src={personal.photo} style={styles.sidebarPhoto} />
          : photoPosition !== 'none' ? <View style={[styles.sidebarPhoto, { backgroundColor: 'rgba(0,0,0,0.15)' }]} /> : null
        }
        <View style={styles.sidebarContent}>
          <Text style={styles.sidebarName}>{personal.firstName}{'\n'}{personal.lastName}</Text>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Kontakt</Text>
            {personal.email ? <Text style={styles.sidebarText}>{'\u2709'}  {personal.email}</Text> : null}
            {personal.phone ? <Text style={styles.sidebarText}>{'\u260E'}  {personal.phone}</Text> : null}
            {personal.city ? <Text style={styles.sidebarText}>{'\u25CE'}  {personal.city}</Text> : null}
            {personal.linkedin ? (
              <Link src={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} style={styles.sidebarText}>
                {'in'}  {personal.linkedin}
              </Link>
            ) : null}
            {personal.website ? (
              <Link src={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} style={styles.sidebarText}>
                {'\u2197'}  {personal.website}
              </Link>
            ) : null}
          </View>

          {renderSidebarSkills()}

          {languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Jezyki</Text>
              {languages.map(lang => (
                <Text key={lang.id} style={styles.sidebarText}>
                  {lang.name}{lang.level ? ` \u2014 ${lang.level}` : ''}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Main content */}
      <View style={styles.main}>
        {!personal.photo && (
          <Text style={{ fontSize: 22, fontFamily: getBoldFont(font), ...boldExtra, color: textColor, marginBottom: 16 }}>
            {personal.firstName} {personal.lastName}
          </Text>
        )}
        {personal.photo && (
          <Text style={{ fontSize: 22, fontFamily: getBoldFont(font), ...boldExtra, color: textColor, marginBottom: 16 }}>
            {personal.firstName} {personal.lastName}
          </Text>
        )}

        {sectionOrder.map(id => renderSection(id))}
        {gdprFooter()}
      </View>
    </Page>
  )
}
