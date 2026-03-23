'use client'

import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'

function buildStyles(accentColor: string) {
  return StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 10,
      flexDirection: 'row',
    },
    sidebar: {
      width: '35%',
      backgroundColor: accentColor,
      paddingTop: 40,
      paddingBottom: 40,
      paddingHorizontal: 20,
    },
    main: {
      width: '65%',
      paddingTop: 40,
      paddingBottom: 40,
      paddingHorizontal: 28,
      backgroundColor: '#ffffff',
    },
    photoContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    photo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: '#ffffff',
    },
    sidebarName: {
      fontSize: 14,
      fontFamily: 'Helvetica-Bold',
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: 16,
    },
    sidebarSectionTitle: {
      fontSize: 9,
      fontFamily: 'Helvetica-Bold',
      color: '#ffffff',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 6,
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.4)',
    },
    sidebarSection: {
      marginBottom: 16,
    },
    contactItem: {
      fontSize: 8.5,
      color: 'rgba(255,255,255,0.9)',
      marginBottom: 4,
      lineHeight: 1.4,
    },
    skillItem: {
      marginBottom: 5,
    },
    skillName: {
      fontSize: 8.5,
      color: 'rgba(255,255,255,0.9)',
      marginBottom: 2,
    },
    skillBarBg: {
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 2,
    },
    skillBarFill: {
      height: 4,
      backgroundColor: '#ffffff',
      borderRadius: 2,
    },
    langItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    langName: {
      fontSize: 8.5,
      color: 'rgba(255,255,255,0.9)',
    },
    langLevel: {
      fontSize: 8.5,
      color: 'rgba(255,255,255,0.7)',
    },
    mainSectionTitle: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      color: accentColor,
      marginBottom: 8,
      paddingBottom: 3,
      borderBottomWidth: 1.5,
      borderBottomColor: accentColor,
    },
    mainSection: {
      marginBottom: 14,
    },
    mainName: {
      fontSize: 24,
      fontFamily: 'Helvetica-Bold',
      color: '#111111',
      marginBottom: 16,
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
      fontSize: 8.5,
      color: '#888888',
    },
    expCompany: {
      fontSize: 9,
      color: accentColor,
      marginBottom: 2,
    },
    expDescription: {
      fontSize: 9,
      lineHeight: 1.5,
      color: '#444444',
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
      fontSize: 8.5,
      color: '#888888',
    },
    eduDegree: {
      fontSize: 9,
      color: '#555555',
    },
    interestRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
    },
    interestTag: {
      fontSize: 8.5,
      color: '#555555',
      borderWidth: 1,
      borderColor: '#cccccc',
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 10,
    },
  })
}

function skillBarWidth(level: string): string {
  if (level === 'basic') return '33%'
  if (level === 'advanced') return '100%'
  return '66%'
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

export function ModernTemplate({ config }: Props) {
  const { personal, summary, experience, education, skills, languages, interests, meta } = config
  const styles = buildStyles(meta.accentColor)

  return (
    <Page size="A4" style={styles.page}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {personal.photo ? (
          <View style={styles.photoContainer}>
            <Image src={personal.photo} style={styles.photo} />
          </View>
        ) : null}

        <Text style={styles.sidebarName}>
          {personal.firstName} {personal.lastName}
        </Text>

        {(personal.email || personal.phone || personal.city || personal.linkedin || personal.website) ? (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Kontakt</Text>
            {personal.email ? <Text style={styles.contactItem}>{personal.email}</Text> : null}
            {personal.phone ? <Text style={styles.contactItem}>{personal.phone}</Text> : null}
            {personal.city ? <Text style={styles.contactItem}>{personal.city}</Text> : null}
            {personal.linkedin ? <Text style={styles.contactItem}>{personal.linkedin}</Text> : null}
            {personal.website ? <Text style={styles.contactItem}>{personal.website}</Text> : null}
          </View>
        ) : null}

        {skills.length > 0 ? (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Umiejetnosci</Text>
            {skills.map((skill) => (
              <View key={skill.id} style={styles.skillItem}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <View style={styles.skillBarBg}>
                  <View style={[styles.skillBarFill, { width: skillBarWidth(skill.level) }]} />
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {languages.length > 0 ? (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Jezyki obce</Text>
            {languages.map((lang) => (
              <View key={lang.id} style={styles.langItem}>
                <Text style={styles.langName}>{lang.name}</Text>
                {lang.level ? <Text style={styles.langLevel}>{lang.level}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {/* Main content */}
      <View style={styles.main}>
        <Text style={styles.mainName}>
          {personal.firstName} {personal.lastName}
        </Text>

        {summary ? (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>O mnie</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {experience.length > 0 ? (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Doswiadczenie zawodowe</Text>
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

        {education.length > 0 ? (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Wyksztalcenie</Text>
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

        {interests.length > 0 ? (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Zainteresowania</Text>
            <View style={styles.interestRow}>
              {interests.map((interest, i) => (
                <Text key={i} style={styles.interestTag}>{interest}</Text>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </Page>
  )
}
