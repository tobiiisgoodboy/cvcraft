'use client'

import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#222222',
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 60,
  },
  name: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
    marginBottom: 4,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  contactItem: {
    fontSize: 9,
    color: '#666666',
  },
  divider: {
    borderBottomWidth: 0.75,
    borderBottomColor: '#dddddd',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#333333',
  },
  expItem: {
    marginBottom: 12,
  },
  expPosition: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
  },
  expMeta: {
    fontSize: 9,
    color: '#888888',
    marginBottom: 3,
  },
  expDescription: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: '#444444',
  },
  eduItem: {
    marginBottom: 10,
  },
  eduSchool: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
  },
  eduMeta: {
    fontSize: 9,
    color: '#888888',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  skillName: {
    fontSize: 9.5,
    color: '#333333',
  },
  skillDots: {
    fontSize: 8,
    color: '#888888',
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  langItem: {
    fontSize: 9.5,
    color: '#333333',
  },
  interestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestItem: {
    fontSize: 9,
    color: '#666666',
  },
  dot: {
    fontSize: 9,
    color: '#cccccc',
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
  return `${s} \u2013 ${e}`
}

interface Props {
  config: CvConfig
}

export function MinimalTemplate({ config }: Props) {
  const { personal, summary, experience, education, skills, languages, interests } = config

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {personal.firstName} {personal.lastName}
          </Text>
        </View>
        {personal.photo ? (
          <Image src={personal.photo} style={styles.photo} />
        ) : null}
      </View>

      {(personal.email || personal.phone || personal.city || personal.linkedin || personal.website) ? (
        <View style={styles.contactRow}>
          {personal.email ? <Text style={styles.contactItem}>{personal.email}</Text> : null}
          {personal.phone ? <Text style={styles.contactItem}>{personal.phone}</Text> : null}
          {personal.city ? <Text style={styles.contactItem}>{personal.city}</Text> : null}
          {personal.linkedin ? <Text style={styles.contactItem}>{personal.linkedin}</Text> : null}
          {personal.website ? <Text style={styles.contactItem}>{personal.website}</Text> : null}
        </View>
      ) : null}

      <View style={styles.divider} />

      {summary ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O mnie</Text>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>
      ) : null}

      {experience.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doswiadczenie</Text>
          {experience.map((exp) => (
            <View key={exp.id} style={styles.expItem}>
              <Text style={styles.expPosition}>{exp.position}</Text>
              <Text style={styles.expMeta}>
                {exp.company}
                {exp.company && (exp.startDate || exp.endDate) ? '  \u00B7  ' : ''}
                {formatDateRange(exp.startDate, exp.endDate, exp.current)}
              </Text>
              {exp.description ? (
                <Text style={styles.expDescription}>{exp.description}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {education.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wyksztalcenie</Text>
          {education.map((edu) => (
            <View key={edu.id} style={styles.eduItem}>
              <Text style={styles.eduSchool}>{edu.school}</Text>
              <Text style={styles.eduMeta}>
                {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                {(edu.degree || edu.field) && (edu.startDate || edu.endDate) ? '  \u00B7  ' : ''}
                {formatDateRange(edu.startDate, edu.endDate, false)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

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

      {languages.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jezyki obce</Text>
          <View style={styles.langRow}>
            {languages.map((lang) => (
              <Text key={lang.id} style={styles.langItem}>
                {lang.name}{lang.level ? ` \u2013 ${lang.level}` : ''}
              </Text>
            ))}
          </View>
        </View>
      ) : null}

      {interests.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zainteresowania</Text>
          <View style={styles.interestRow}>
            {interests.map((interest, i) => (
              <Text key={i} style={styles.interestItem}>
                {interest}{i < interests.length - 1 ? '  \u00B7' : ''}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
    </Page>
  )
}
