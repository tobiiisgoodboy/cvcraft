'use client'

import React from 'react'
import { Page, View, Text, Image, StyleSheet, Link } from '@react-pdf/renderer'
import { CvConfig } from '@/lib/schema'

interface Props { config: CvConfig }

export function MinimalTemplate({ config }: Props) {
  const accent = config.meta.accentColor || '#2563eb'
  const photoPosition = config.meta.photoPosition ?? 'right'
  const { personal, summary, experience, education, skills, languages, interests, certificates, projects } = config

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
  const plainContactItems = [personal.email, personal.phone, personal.city].filter(Boolean)

  const DEFAULT_ORDER = ['summary', 'experience', 'projects', 'education', 'certificates', 'skills', 'languages', 'interests']
  const sectionOrder = config.meta.sectionOrder && config.meta.sectionOrder.length > 0 ? config.meta.sectionOrder : DEFAULT_ORDER

  function renderSection(id: string): React.ReactNode {
    switch (id) {
      case 'summary':
        return summary ? (
          <View key="summary" style={styles.section}>
            <Text style={styles.sectionTitle}>O mnie</Text>
            <Text style={{ fontSize: 9.5, lineHeight: 1.7, color: '#374151' }}>{summary}</Text>
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
                    <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{proj.name}</Text>
                  </View>
                  {proj.technologies ? (
                    <Text style={{ fontSize: 9, color: '#6b7280', fontFamily: 'Helvetica-Oblique', marginBottom: 2 }}>{proj.technologies}</Text>
                  ) : null}
                  {proj.description ? <Text style={{ fontSize: 8.5, lineHeight: 1.6, color: '#374151' }}>{proj.description}</Text> : null}
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
                  <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{cert.name}</Text>
                  {cert.date ? <Text style={{ fontSize: 8.5, color: '#9ca3af' }}>{cert.date}</Text> : null}
                </View>
                {cert.issuer ? <Text style={{ fontSize: 9, color: '#6b7280', fontFamily: 'Helvetica-Oblique' }}>{cert.issuer}</Text> : null}
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

      case 'skills':
        return skills.length > 0 ? (
          <View key="skills" style={styles.section}>
            <Text style={styles.sectionTitle}>Umiejetnosci</Text>
            <Text style={styles.skillText}>
              {skills.map((s, i) => `${s.name} (${levelMap[s.level] ?? s.level})${i < skills.length - 1 ? ',  ' : ''}`).join('')}
            </Text>
          </View>
        ) : null

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
        {plainContactItems.map((item, i) => (
          <View key={i} style={{ flexDirection: 'row' }}>
            {i > 0 && <Text style={styles.contactSep}>{'\u00B7'}</Text>}
            <Text style={styles.contactItem}>{item}</Text>
          </View>
        ))}
        {personal.linkedin ? (
          <View style={{ flexDirection: 'row' }}>
            {(plainContactItems.length > 0) && <Text style={styles.contactSep}>{'\u00B7'}</Text>}
            <Link src={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} style={styles.contactItem}>
              {personal.linkedin}
            </Link>
          </View>
        ) : null}
        {personal.website ? (
          <View style={{ flexDirection: 'row' }}>
            {(plainContactItems.length > 0 || personal.linkedin) && <Text style={styles.contactSep}>{'\u00B7'}</Text>}
            <Link src={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} style={styles.contactItem}>
              {personal.website}
            </Link>
          </View>
        ) : null}
      </View>

      {sectionOrder.map(id => renderSection(id))}
    </Page>
  )
}
