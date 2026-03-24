'use client'

import React from 'react'
import { Page, View, Text, Image, StyleSheet, Link } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'
import { registerFonts, getFontFamily, getBoldFont, getItalicFont, CvFont } from '@/lib/fonts'

const GDPR_DEFAULT_PL = 'Wyrażam zgodę na przetwarzanie moich danych osobowych przez [firma] w celu prowadzenia rekrutacji na aplikowane przeze mnie stanowisko.'
const GDPR_DEFAULT_EN = 'I hereby consent to my personal data being processed by [firma] for the purpose of considering my application for the vacancy.'

interface Props { config: CvConfig }

export function MinimalTemplate({ config }: Props) {
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
    page: { fontFamily: getFontFamily(font), fontSize: 10, color: textColor, backgroundColor: bgColor, paddingHorizontal: 56, paddingTop: 44, paddingBottom: 44 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 },
    headerLeft: { flex: 1 },
    name: { fontSize: 30, fontFamily: getBoldFont(font), ...boldExtra, color: textColor, letterSpacing: -1, lineHeight: 1.1 },
    accentLine: { height: 2, backgroundColor: accent, marginTop: 8, marginBottom: 14, width: 48 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 0, marginBottom: 24 },
    contactItem: { fontSize: 8.5, color: '#6b7280' },
    contactSep: { fontSize: 8.5, color: '#d1d5db', marginHorizontal: 6 },
    photo: { width: 68, height: 82, borderRadius: 2, marginLeft: 20 },
    section: { marginBottom: 18 },
    sectionTitle: { fontSize: 8, fontFamily: getBoldFont(font), ...boldExtra, textTransform: 'uppercase', letterSpacing: 2, color: accent, marginBottom: 10 },
    expItem: { marginBottom: 11 },
    expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
    expPosition: { fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra },
    expDates: { fontSize: 8.5, color: '#9ca3af' },
    expCompany: { fontSize: 9, color: '#6b7280', fontFamily: getItalicFont(font), ...italicExtra, marginBottom: 3 },
    expDesc: { fontSize: 8.5, lineHeight: 1.6, color: textColor },
    separator: { borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', marginVertical: 14 },
    eduItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    eduLeft: { flex: 1 },
    eduSchool: { fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra },
    eduDegree: { fontSize: 9, color: '#6b7280', marginTop: 1 },
    eduDates: { fontSize: 8.5, color: '#9ca3af' },
    skillText: { fontSize: 9.5, color: textColor, lineHeight: 1.7 },
    langText: { fontSize: 9.5, color: textColor, lineHeight: 1.7 },
    interestText: { fontSize: 9.5, color: textColor, lineHeight: 1.7 },
    // skill bars grid
    skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0 },
    skillItem: { width: '50%', marginBottom: 6, paddingRight: 12 },
    skillName: { fontSize: 9, color: textColor, marginBottom: 2 },
    skillBarBg: { flexDirection: 'row', gap: 2 },
    // skill tags
    skillTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    // skill dots
    skillDotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0 },
    skillDotsItem: { width: '50%', marginBottom: 5, paddingRight: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
    // skill list
    skillListItem: { marginBottom: 3 },
    // skill layout: categories
    skillCategoryHeader: { fontSize: 8, fontFamily: getBoldFont(font), ...boldExtra, color: accent, marginBottom: 4, marginTop: 8, letterSpacing: 0.5 },
    skillCategoryTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 },
    // contact icon
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
            <Text style={styles.sectionTitle}>Umiejetnosci</Text>
            <View style={styles.skillsGrid}>
              {skills.map(skill => (
                <View key={skill.id} style={styles.skillItem}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <SkillBar level={skill.level} />
                </View>
              ))}
            </View>
            <View style={styles.separator} />
          </View>
        )
      case 'tags': {
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Umiejetnosci</Text>
            <View style={styles.skillTagsRow}>
              {skills.map(skill => (
                <Text key={skill.id} style={{ fontSize: 9, color: accent, backgroundColor: accent + '22', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 10 }}>
                  {skill.name}
                </Text>
              ))}
            </View>
            <View style={styles.separator} />
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Umiejetnosci</Text>
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
            <View style={styles.separator} />
          </View>
        )
      }
      case 'dots': {
        const dotCount: Record<string, number> = { basic: 1, medium: 2, advanced: 3 }
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Umiejetnosci</Text>
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
            <View style={styles.separator} />
          </View>
        )
      }
      case 'list': {
        const levelLabel: Record<string, string> = { basic: 'Podstawowy', medium: 'Sredni', advanced: 'Zaawansowany' }
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Umiejetnosci</Text>
            {skills.map(skill => (
              <View key={skill.id} style={styles.skillListItem}>
                <Text style={{ fontSize: 9, color: textColor }}>{'\u2022'} {skill.name} ({levelLabel[skill.level] ?? skill.level})</Text>
              </View>
            ))}
            <View style={styles.separator} />
          </View>
        )
      }
      default:
        return null
    }
  }

  function formatDate(start: string, end: string, current: boolean) {
    const s = start || ''
    const e = current ? 'obecnie' : (end || '')
    if (!s && !e) return ''
    if (!s) return e
    if (!e) return s
    return `${s} \u2013 ${e}`
  }

  const levelMap: Record<string, string> = { basic: 'podstawowy', medium: 'srednio zaawansowany', advanced: 'zaawansowany' }

  const DEFAULT_ORDER = ['summary', 'experience', 'projects', 'education', 'certificates', 'awards', 'skills', 'languages', 'interests']
  const sectionOrder = config.meta.sectionOrder && config.meta.sectionOrder.length > 0 ? config.meta.sectionOrder : DEFAULT_ORDER

  function renderSection(id: string): React.ReactNode {
    switch (id) {
      case 'summary':
        return summary ? (
          <View key="summary" style={styles.section}>
            <Text style={styles.sectionTitle}>O mnie</Text>
            <Text style={{ fontSize: 9.5, lineHeight: 1.7, color: textColor }}>{summary}</Text>
            <View style={styles.separator} />
          </View>
        ) : null

      case 'experience':
        return experience.length > 0 ? (
          <View key="experience" style={styles.section}>
            <Text style={styles.sectionTitle}>Doswiadczenie</Text>
            {experience.map((exp, i) => (
              <View key={exp.id}>
                <View style={styles.expItem}>
                  <View style={styles.expRow}>
                    <Text style={styles.expPosition}>{exp.position}</Text>
                    <Text style={styles.expDates}>{formatDate(exp.startDate, exp.endDate, exp.current)}</Text>
                  </View>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  {exp.description ? <Text style={styles.expDesc}>{exp.description}</Text> : null}
                </View>
                {i < experience.length - 1 && <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6', marginBottom: 8 }} />}
              </View>
            ))}
            <View style={styles.separator} />
          </View>
        ) : null

      case 'projects':
        return projects.length > 0 ? (
          <View key="projects" style={styles.section}>
            <Text style={styles.sectionTitle}>Projekty</Text>
            {projects.map((proj, i) => (
              <View key={proj.id}>
                <View style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 }}>
                    <Text style={{ fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra }}>{proj.name}</Text>
                  </View>
                  {proj.technologies ? (
                    <Text style={{ fontSize: 9, color: '#6b7280', fontFamily: getItalicFont(font), ...italicExtra, marginBottom: 2 }}>{proj.technologies}</Text>
                  ) : null}
                  {proj.description ? <Text style={{ fontSize: 8.5, lineHeight: 1.6, color: textColor }}>{proj.description}</Text> : null}
                  {proj.url ? (
                    <Link src={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} style={{ fontSize: 8.5, color: accent, marginTop: 2 }}>
                      {proj.url}
                    </Link>
                  ) : null}
                </View>
                {i < projects.length - 1 && <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6', marginBottom: 8 }} />}
              </View>
            ))}
            <View style={styles.separator} />
          </View>
        ) : null

      case 'education':
        return education.length > 0 ? (
          <View key="education" style={styles.section}>
            <Text style={styles.sectionTitle}>Wyksztalcenie</Text>
            {education.map(edu => (
              <View key={edu.id} style={styles.eduItem}>
                <View style={styles.eduLeft}>
                  <Text style={styles.eduSchool}>{edu.school}</Text>
                  <Text style={styles.eduDegree}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</Text>
                </View>
                <Text style={styles.eduDates}>{formatDate(edu.startDate, edu.endDate, false)}</Text>
              </View>
            ))}
            <View style={styles.separator} />
          </View>
        ) : null

      case 'certificates':
        return certificates.length > 0 ? (
          <View key="certificates" style={styles.section}>
            <Text style={styles.sectionTitle}>Certyfikaty i kursy</Text>
            {certificates.map(cert => (
              <View key={cert.id} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 }}>
                  <Text style={{ fontSize: 10, fontFamily: getBoldFont(font), ...boldExtra }}>{cert.name}</Text>
                  {cert.date ? <Text style={{ fontSize: 8.5, color: '#9ca3af' }}>{cert.date}</Text> : null}
                </View>
                {cert.issuer ? <Text style={{ fontSize: 9, color: '#6b7280', fontFamily: getItalicFont(font), ...italicExtra }}>{cert.issuer}</Text> : null}
                {cert.url ? (
                  <Link src={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`} style={{ fontSize: 8.5, color: accent, marginTop: 1 }}>
                    {cert.url}
                  </Link>
                ) : null}
              </View>
            ))}
            <View style={styles.separator} />
          </View>
        ) : null

      case 'awards':
        return awards && awards.length > 0 ? (
          <View key="awards" style={styles.section}>
            <Text style={styles.sectionTitle}>Nagrody i wyroznienia</Text>
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
            <View style={styles.separator} />
          </View>
        ) : null

      case 'skills':
        return renderSkills()

      case 'languages':
        return languages.length > 0 ? (
          <View key="languages" style={styles.section}>
            <Text style={styles.sectionTitle}>Jezyki</Text>
            <Text style={styles.langText}>
              {languages.map((l, i) => `${l.name}${l.level ? ` \u2014 ${l.level}` : ''}${i < languages.length - 1 ? ',  ' : ''}`).join('')}
            </Text>
          </View>
        ) : null

      case 'interests':
        return interests.length > 0 ? (
          <View key="interests" style={styles.section}>
            <Text style={styles.sectionTitle}>Zainteresowania</Text>
            <Text style={styles.interestText}>{interests.join(',  ')}</Text>
          </View>
        ) : null

      default:
        return null
    }
  }

  // suppress unused var warning for levelMap — used indirectly via renderSection/skills text logic
  void levelMap

  const contactItemsWithIcons: Array<{ value: string; icon: string }> = [
    { value: personal.email, icon: '\u2709' },
    { value: personal.phone, icon: '\u260E' },
    { value: personal.city, icon: '\u25CE' },
  ].filter(c => Boolean(c.value))

  function gdprFooter() {
    if (!config.meta.gdprEnabled) return null
    const lang = config.meta.gdprLanguage ?? 'pl'
    let text = config.meta.gdprText?.trim() || (lang === 'pl' ? GDPR_DEFAULT_PL : GDPR_DEFAULT_EN)
    const company = config.meta.gdprCompany?.trim()
    if (company) text = text.replace('[firma]', company)
    return <Text style={styles.gdprText}>{text}</Text>
  }

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {personal.photo && photoPosition === 'left' && (
          <Image src={personal.photo} style={[styles.photo, { marginLeft: 0, marginRight: 20 }]} />
        )}
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{personal.firstName}{'\n'}{personal.lastName}</Text>
        </View>
        {personal.photo && photoPosition === 'right' && (
          <Image src={personal.photo} style={styles.photo} />
        )}
      </View>
      <View style={styles.accentLine} />
      <View style={styles.contactRow}>
        {contactItemsWithIcons.map((c, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
            {i > 0 && <Text style={styles.contactSep}>{'\u00B7'}</Text>}
            <Text style={styles.contactIcon}>{c.icon} </Text>
            <Text style={styles.contactItem}>{c.value}</Text>
          </View>
        ))}
        {personal.linkedin ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {(contactItemsWithIcons.length > 0) && <Text style={styles.contactSep}>{'\u00B7'}</Text>}
            <Text style={styles.contactIcon}>in </Text>
            <Link src={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} style={styles.contactItem}>
              {personal.linkedin}
            </Link>
          </View>
        ) : null}
        {personal.website ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {(contactItemsWithIcons.length > 0 || personal.linkedin) && <Text style={styles.contactSep}>{'\u00B7'}</Text>}
            <Text style={styles.contactIcon}>{'\u2197'} </Text>
            <Link src={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} style={styles.contactItem}>
              {personal.website}
            </Link>
          </View>
        ) : null}
      </View>

      {sectionOrder.map(id => renderSection(id))}
      {gdprFooter()}
    </Page>
  )
}
