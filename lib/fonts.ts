import { Font } from '@react-pdf/renderer'

let registered = false

export function registerFonts() {
  if (registered) return
  registered = true

  Font.register({
    family: 'Roboto',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf', fontWeight: 700 },
      { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu51xIIzI.ttf', fontWeight: 400, fontStyle: 'italic' },
    ],
  })
}

export type CvFont = 'Helvetica' | 'Times-Roman' | 'Roboto'

export function getFontFamily(font: CvFont): string {
  return font
}

export function getBoldFont(font: CvFont): string {
  if (font === 'Times-Roman') return 'Times-Bold'
  if (font === 'Roboto') return 'Roboto'
  return 'Helvetica-Bold'
}

export function getItalicFont(font: CvFont): string {
  if (font === 'Times-Roman') return 'Times-Italic'
  if (font === 'Roboto') return 'Roboto'
  return 'Helvetica-Oblique'
}

export function getBoldWeight(font: CvFont): number | undefined {
  if (font === 'Roboto') return 700
  return undefined
}

export function getItalicStyle(font: CvFont): string | undefined {
  if (font === 'Roboto') return 'italic'
  return undefined
}
