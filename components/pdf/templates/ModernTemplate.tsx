'use client'

import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'

interface Props { config: CvConfig }

export function ModernTemplate({ config }: Props) {
  const accent = config.meta.accentColor || '#2563eb'
  const { personal, summary, experience, education, skills, languages, interests } = config

  const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, flexDirection: 'row' },
    sidebar: { width: '32%', backgroundColor: accent, minHeight: '100%', paddingBottom: 36 },
    sidebarPhoto: { width: '100%', height: 130 },
    sidebarContent: { paddingHorizontal: 18, paddingTop: 16 },
    sidebarName: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 3, lineHeight: 1.2 },
    sidebarSection: { marginTop: 18 },
    sidebarSectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)', marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.25)' },
    sidebarText: { fontSize: 8.5, color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
    sidebarSkillItem: { marginBottom: 7 },
    sidebarSkillName: { fontSize: 8.5, color: '#ffffff', marginBottom: 2.5 },
    sidebarBarBg: { backgroundColor: 'rgba(255,255,255,0.25)', height: 3, borderRadius: 2, width: '100%' },
    main: { flex: 1, paddingHorizontal: 28, paddingTop: 32, paddingBottom: 36 },
    mainSection: { marginBottom: 16 },
    mainSectionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: '#374151', marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1.5, borderBottomColor: accent },
    expItem: { marginBottom: 10, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#e5e7eb' },
    expPosition: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111827' },
    expCompany: { fontSize: 8.5, color: accent, fontFamily: 'Helvetica-Oblique', marginBottom: 2 },
    expDates: { fontSize: 8, color: '#9ca3af' },
    expDesc: { fontSize: 8.5, lineHeight: 1.55, color: '#374151', marginTop: 3 },
    eduItem: { marginBottom: 8 },
    eduSchool: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111827' },
    eduDegree: { fontSize: 9, color: '#6b7280' },
    eduDates: { fontSize: 8, color: '#9ca3af' },
    interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
    interestTag: { fontSize: 8.5, color: accent, backgroundColor: '#eff6ff', paddingVertical: 2.5, paddingHorizontal: 7, borderRadius: 10, borderWidth: 1, borderColor: '#bfdbfe' },
  })

  function SidebarSkillBar({ level }: { level: string }) {
    const pct = level === 'basic' ? '33%' : level === 'advanced' ? '100%' : '66%'
    return (
      <View style={styles.sidebarBarBg}>
        <View style={{ backgroundColor: '#ffffff', height: 3, borderRadius: 2, width: pct }} />
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

  return (
    <Page size="A4" style={styles.page}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {personal.photo
          ? <Image src={personal.photo} style={styles.sidebarPhoto} />
          : <View style={[styles.sidebarPhoto, { backgroundColor: 'rgba(0,0,0,0.15)' }]} />
        }
        <View style={styles.sidebarContent}>
          <Text style={styles.sidebarName}>{personal.firstName}{'\n'}{personal.lastName}</Text>

          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Kontakt</Text>
            {personal.email ? <Text style={styles.sidebarText}>{'\u2709'}  {personal.email}</Text> : null}
            {personal.phone ? <Text style={styles.sidebarText}>{'\u260E'}  {personal.phone}</Text> : null}
            {personal.city ? <Text style={styles.sidebarText}>{'\u25CE'}  {personal.city}</Text> : null}
            {personal.linkedin ? <Text style={styles.sidebarText}>{'in'}  {personal.linkedin}</Text> : null}
            {personal.website ? <Text style={styles.sidebarText}>{'\u2197'}  {personal.website}</Text> : null}
          </View>

          {skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Umiejetnosci</Text>
              {skills.map(skill => (
                <View key={skill.id} style={styles.sidebarSkillItem}>
                  <Text style={styles.sidebarSkillName}>{skill.name}</Text>
                  <SidebarSkillBar level={skill.level} />
                </View>
              ))}
            </View>
          )}

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
          <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 16 }}>
            {personal.firstName} {personal.lastName}
          </Text>
        )}
        {personal.photo && (
          <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#111827', marginBottom: 16 }}>
            {personal.firstName} {personal.lastName}
          </Text>
        )}

        {summary ? (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Podsumowanie</Text>
            <Text style={{ fontSize: 9.5, lineHeight: 1.6, color: '#374151' }}>{summary}</Text>
          </View>
        ) : null}

        {experience.length > 0 && (
          <View style={styles.mainSection}>
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
        )}

        {education.length > 0 && (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Wyksztalcenie</Text>
            {education.map(edu => (
              <View key={edu.id} style={styles.eduItem}>
                <Text style={styles.eduSchool}>{edu.school}</Text>
                <Text style={styles.eduDegree}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</Text>
                <Text style={styles.eduDates}>{formatDate(edu.startDate, edu.endDate, false)}</Text>
              </View>
            ))}
          </View>
        )}

        {interests.length > 0 && (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Zainteresowania</Text>
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
