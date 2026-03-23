'use client'

import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'

interface Props { config: CvConfig }

export function MinimalTemplate({ config }: Props) {
  const accent = config.meta.accentColor || '#2563eb'
  const { personal, summary, experience, education, skills, languages, interests } = config

  const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, color: '#111827', backgroundColor: '#ffffff', paddingHorizontal: 56, paddingTop: 44, paddingBottom: 44 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 },
    headerLeft: { flex: 1 },
    name: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: '#111827', letterSpacing: -1, lineHeight: 1.1 },
    accentLine: { height: 2, backgroundColor: accent, marginTop: 8, marginBottom: 14, width: 48 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 0, marginBottom: 24 },
    contactItem: { fontSize: 8.5, color: '#6b7280' },
    contactSep: { fontSize: 8.5, color: '#d1d5db', marginHorizontal: 6 },
    photo: { width: 68, height: 82, borderRadius: 2, marginLeft: 20 },
    section: { marginBottom: 18 },
    sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 2, color: accent, marginBottom: 10 },
    expItem: { marginBottom: 11 },
    expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
    expPosition: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
    expDates: { fontSize: 8.5, color: '#9ca3af' },
    expCompany: { fontSize: 9, color: '#6b7280', fontFamily: 'Helvetica-Oblique', marginBottom: 3 },
    expDesc: { fontSize: 8.5, lineHeight: 1.6, color: '#374151' },
    separator: { borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', marginVertical: 14 },
    eduItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    eduLeft: { flex: 1 },
    eduSchool: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
    eduDegree: { fontSize: 9, color: '#6b7280', marginTop: 1 },
    eduDates: { fontSize: 8.5, color: '#9ca3af' },
    skillText: { fontSize: 9.5, color: '#374151', lineHeight: 1.7 },
    langText: { fontSize: 9.5, color: '#374151', lineHeight: 1.7 },
    interestText: { fontSize: 9.5, color: '#374151', lineHeight: 1.7 },
  })

  function formatDate(start: string, end: string, current: boolean) {
    const s = start || ''
    const e = current ? 'obecnie' : (end || '')
    if (!s && !e) return ''
    if (!s) return e
    if (!e) return s
    return `${s} \u2013 ${e}`
  }

  const levelMap: Record<string, string> = { basic: 'podstawowy', medium: 'srednio zaawansowany', advanced: 'zaawansowany' }
  const contactItems = [personal.email, personal.phone, personal.city, personal.linkedin, personal.website].filter(Boolean)

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{personal.firstName}{'\n'}{personal.lastName}</Text>
        </View>
        {personal.photo && <Image src={personal.photo} style={styles.photo} />}
      </View>
      <View style={styles.accentLine} />
      <View style={styles.contactRow}>
        {contactItems.map((item, i) => (
          <View key={i} style={{ flexDirection: 'row' }}>
            {i > 0 && <Text style={styles.contactSep}>{'\u00B7'}</Text>}
            <Text style={styles.contactItem}>{item}</Text>
          </View>
        ))}
      </View>

      {summary ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O mnie</Text>
          <Text style={{ fontSize: 9.5, lineHeight: 1.7, color: '#374151' }}>{summary}</Text>
          <View style={styles.separator} />
        </View>
      ) : null}

      {experience.length > 0 && (
        <View style={styles.section}>
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
          <View style={styles.separator} />
        </View>
      )}

      {skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Umiejetnosci</Text>
          <Text style={styles.skillText}>
            {skills.map((s, i) => `${s.name} (${levelMap[s.level] ?? s.level})${i < skills.length - 1 ? ',  ' : ''}`).join('')}
          </Text>
        </View>
      )}

      {languages.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jezyki</Text>
          <Text style={styles.langText}>
            {languages.map((l, i) => `${l.name}${l.level ? ` \u2014 ${l.level}` : ''}${i < languages.length - 1 ? ',  ' : ''}`).join('')}
          </Text>
        </View>
      )}

      {interests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zainteresowania</Text>
          <Text style={styles.interestText}>{interests.join(',  ')}</Text>
        </View>
      )}
    </Page>
  )
}
