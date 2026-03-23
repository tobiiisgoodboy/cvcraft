'use client'

import { Page, View, Text, Image, StyleSheet, Link } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'

interface Props { config: CvConfig }

export function ClassicTemplate({ config }: Props) {
  const accent = config.meta.accentColor || '#2563eb'
  const photoPosition = config.meta.photoPosition ?? 'right'
  const { personal, summary, experience, education, skills, languages, interests, certificates, projects } = config

  const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, color: '#1f2937', backgroundColor: '#ffffff', paddingTop: 0, paddingBottom: 36, paddingHorizontal: 0 },
    topBar: { height: 5, backgroundColor: accent },
    content: { paddingHorizontal: 48, paddingTop: 28 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    headerLeft: { flex: 1, paddingRight: 16 },
    name: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 3, letterSpacing: -0.5 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 0, marginTop: 6 },
    contactItem: { fontSize: 8.5, color: '#6b7280' },
    contactSep: { fontSize: 8.5, color: '#d1d5db', marginHorizontal: 5 },
    photo: { width: 72, height: 88, borderRadius: 3 },
    sectionTitle: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1.2, color: accent, marginBottom: 8, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    section: { marginBottom: 16 },
    expItem: { marginBottom: 10 },
    expRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    expPosition: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111827' },
    expDates: { fontSize: 8.5, color: '#9ca3af' },
    expCompany: { fontSize: 9, color: accent, marginBottom: 3, fontFamily: 'Helvetica-Oblique' },
    expDesc: { fontSize: 8.5, lineHeight: 1.55, color: '#374151', marginTop: 2 },
    eduItem: { marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
    eduLeft: { flex: 1 },
    eduSchool: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111827' },
    eduDegree: { fontSize: 9, color: '#6b7280', marginTop: 1 },
    eduDates: { fontSize: 8.5, color: '#9ca3af' },
    skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0 },
    skillItem: { width: '50%', marginBottom: 6, paddingRight: 12 },
    skillName: { fontSize: 9, color: '#374151', marginBottom: 2 },
    skillBarBg: { flexDirection: 'row', gap: 2 },
    langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    langName: { fontFamily: 'Helvetica-Bold', color: '#374151' },
    langLevel: { color: '#9ca3af' },
    interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    interestTag: { fontSize: 8.5, color: '#374151', backgroundColor: '#f3f4f6', paddingVertical: 2.5, paddingHorizontal: 7, borderRadius: 10 },
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

  function formatDate(start: string, end: string, current: boolean) {
    const s = start || ''
    const e = current ? 'obecnie' : (end || '')
    if (!s && !e) return ''
    if (!s) return e
    if (!e) return s
    return `${s} \u2013 ${e}`
  }

  const plainContactItems = [personal.email, personal.phone, personal.city].filter(Boolean)

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
              {plainContactItems.map((item, i) => (
                <View key={i} style={{ flexDirection: 'row' }}>
                  {i > 0 && <Text style={styles.contactSep}>{'\u2022'}</Text>}
                  <Text style={styles.contactItem}>{item}</Text>
                </View>
              ))}
              {personal.linkedin ? (
                <View style={{ flexDirection: 'row' }}>
                  {(plainContactItems.length > 0) && <Text style={styles.contactSep}>{'\u2022'}</Text>}
                  <Link src={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} style={styles.contactItem}>
                    {personal.linkedin}
                  </Link>
                </View>
              ) : null}
              {personal.website ? (
                <View style={{ flexDirection: 'row' }}>
                  {(plainContactItems.length > 0 || personal.linkedin) && <Text style={styles.contactSep}>{'\u2022'}</Text>}
                  <Link src={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} style={styles.contactItem}>
                    {personal.website}
                  </Link>
                </View>
              ) : null}
            </View>
          </View>
          {personal.photo && photoPosition === 'right' && (
            <Image src={personal.photo} style={styles.photo} />
          )}
        </View>

        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Podsumowanie</Text>
            <Text style={{ fontSize: 9.5, lineHeight: 1.6, color: '#374151' }}>{summary}</Text>
          </View>
        ) : null}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Doswiadczenie zawodowe</Text>
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
        )}

        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projekty</Text>
            {projects.map(proj => (
              <View key={proj.id} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111827' }}>{proj.name}</Text>
                  {proj.technologies ? (
                    <Text style={{ fontSize: 8.5, color: '#6b7280', fontFamily: 'Helvetica-Oblique' }}>{proj.technologies}</Text>
                  ) : null}
                </View>
                {proj.description ? <Text style={{ fontSize: 8.5, lineHeight: 1.55, color: '#374151', marginTop: 2 }}>{proj.description}</Text> : null}
                {proj.url ? (
                  <Link src={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} style={{ fontSize: 8.5, color: accent, marginTop: 2 }}>
                    {proj.url}
                  </Link>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
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
          </View>
        )}

        {certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certyfikaty i kursy</Text>
            {certificates.map(cert => (
              <View key={cert.id} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111827' }}>{cert.name}</Text>
                  {cert.date ? <Text style={{ fontSize: 8.5, color: '#9ca3af' }}>{cert.date}</Text> : null}
                </View>
                {cert.issuer ? <Text style={{ fontSize: 9, color: accent, fontFamily: 'Helvetica-Oblique' }}>{cert.issuer}</Text> : null}
                {cert.url ? (
                  <Link src={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`} style={{ fontSize: 8.5, color: accent, marginTop: 1 }}>
                    {cert.url}
                  </Link>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
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
          </View>
        )}

        {languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jezyki obce</Text>
            <View style={styles.langRow}>
              {languages.map(lang => (
                <View key={lang.id} style={{ flexDirection: 'row', gap: 3 }}>
                  <Text style={styles.langName}>{lang.name}</Text>
                  {lang.level ? <Text style={styles.langLevel}>({lang.level})</Text> : null}
                </View>
              ))}
            </View>
          </View>
        )}

        {interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zainteresowania</Text>
            <View style={styles.interestRow}>
              {interests.map((interest, i) => (
                <Text key={i} style={styles.interestTag}>{interest}</Text>
              ))}
            </View>
          </View>
        )}
      </View>
    </Page>
  )
}
