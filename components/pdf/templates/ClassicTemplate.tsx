'use client'

import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  contactItem: {
    fontSize: 9,
    color: '#444444',
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginLeft: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginVertical: 10,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#111111',
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: '#111111',
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
  },
  expItem: {
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  expPosition: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
  },
  expDates: {
    fontSize: 9,
    color: '#666666',
  },
  expCompany: {
    fontSize: 9,
    color: '#444444',
    marginBottom: 3,
  },
  expDescription: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#333333',
  },
  eduItem: {
    marginBottom: 8,
  },
  eduHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eduSchool: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
  },
  eduDates: {
    fontSize: 9,
    color: '#666666',
  },
  eduDegree: {
    fontSize: 9,
    color: '#444444',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skillName: {
    fontSize: 9,
    color: '#333333',
  },
  skillDots: {
    fontSize: 9,
    color: '#666666',
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  langItem: {
    fontSize: 9,
    color: '#333333',
  },
  langLevel: {
    color: '#666666',
  },
  interestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestTag: {
    fontSize: 9,
    color: '#444444',
    backgroundColor: '#f0f0f0',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
})

function skillDots(level: string) {
  if (level === 'basic') return '\u25CF\u25CB\u25CB'
  if (level === 'advanced') return '\u25CF\u25CF\u25CF'
  return '\u25CF\u25CF\u25CB'
}

function formatDateRange(start: string, end: string, current: boolean) {
  const s = start || ''
  const e = current ? 'obecnie' : end || ''
  if (!s && !e) return ''
  if (!s) return e
  if (!e) return s
  return `${s} - ${e}`
}

interface Props {
  config: CvConfig
}

export function ClassicTemplate({ config }: Props) {
  const { personal, summary, experience, education, skills, languages, interests } = config
  const hasContact = personal.email || personal.phone || personal.city || personal.linkedin || personal.website

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>
            {personal.firstName} {personal.lastName}
          </Text>
          {hasContact && (
            <View style={styles.contactRow}>
              {personal.email ? <Text style={styles.contactItem}>{personal.email}</Text> : null}
              {personal.phone ? <Text style={styles.contactItem}>{personal.phone}</Text> : null}
              {personal.city ? <Text style={styles.contactItem}>{personal.city}</Text> : null}
              {personal.linkedin ? <Text style={styles.contactItem}>{personal.linkedin}</Text> : null}
              {personal.website ? <Text style={styles.contactItem}>{personal.website}</Text> : null}
            </View>
          )}
        </View>
        {personal.photo ? (
          <Image src={personal.photo} style={styles.photo} />
        ) : null}
      </View>

      <View style={styles.divider} />

      {/* Summary */}
      {summary ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Podsumowanie</Text>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>
      ) : null}

      {/* Experience */}
      {experience.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doswiadczenie zawodowe</Text>
          {experience.map((exp) => (
            <View key={exp.id} style={styles.expItem}>
              <View style={styles.expHeader}>
                <Text style={styles.expPosition}>{exp.position}</Text>
                <Text style={styles.expDates}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </Text>
              </View>
              <Text style={styles.expCompany}>{exp.company}</Text>
              {exp.description ? (
                <Text style={styles.expDescription}>{exp.description}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Education */}
      {education.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wyksztalcenie</Text>
          {education.map((edu) => (
            <View key={edu.id} style={styles.eduItem}>
              <View style={styles.eduHeader}>
                <Text style={styles.eduSchool}>{edu.school}</Text>
                <Text style={styles.eduDates}>
                  {formatDateRange(edu.startDate, edu.endDate, false)}
                </Text>
              </View>
              <Text style={styles.eduDegree}>
                {edu.degree}{edu.field ? `, ${edu.field}` : ''}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Skills */}
      {skills.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Umiejetnosci</Text>
          <View style={styles.skillsRow}>
            {skills.map((skill) => (
              <View key={skill.id} style={styles.skillItem}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillDots}>{skillDots(skill.level)}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Languages */}
      {languages.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jezyki obce</Text>
          <View style={styles.langRow}>
            {languages.map((lang) => (
              <Text key={lang.id} style={styles.langItem}>
                {lang.name}
                {lang.level ? <Text style={styles.langLevel}> ({lang.level})</Text> : null}
              </Text>
            ))}
          </View>
        </View>
      ) : null}

      {/* Interests */}
      {interests.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zainteresowania</Text>
          <View style={styles.interestRow}>
            {interests.map((interest, i) => (
              <Text key={i} style={styles.interestTag}>{interest}</Text>
            ))}
          </View>
        </View>
      ) : null}
    </Page>
  )
}
