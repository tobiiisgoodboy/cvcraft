import { Font } from '@react-pdf/renderer'

let registered = false

// Wbudowane fonty react-pdf (Helvetica, Times-Roman) uzywaja kodowania WinAnsi,
// ktore NIE zawiera polskich znakow (ą ę ł ś ż ź ć ń). Dlatego dla kazdej opcji
// fontu rejestrujemy TTF z Google Fonts z podzbiorem latin-ext (pelne PL glify).
// Bold/italic jako osobne rodziny, bo szablony dla nie-Roboto nie ustawiaja fontWeight/fontStyle.
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

  // Sans (opcja "Helvetica") -> Open Sans z PL glifami
  Font.register({ family: 'HelveticaPL', fonts: [{ src: 'https://fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4n.ttf' }] })
  Font.register({ family: 'HelveticaPL-Bold', fonts: [{ src: 'https://fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1y4n.ttf' }] })
  Font.register({ family: 'HelveticaPL-Italic', fonts: [{ src: 'https://fonts.gstatic.com/s/opensans/v44/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0Rk8ZkaVc.ttf' }] })

  // Serif (opcja "Times-Roman") -> PT Serif z PL glifami
  Font.register({ family: 'TimesPL', fonts: [{ src: 'https://fonts.gstatic.com/s/ptserif/v19/EJRVQgYoZZY2vCFuvDFR.ttf' }] })
  Font.register({ family: 'TimesPL-Bold', fonts: [{ src: 'https://fonts.gstatic.com/s/ptserif/v19/EJRSQgYoZZY2vCFuvAnt65qV.ttf' }] })
  Font.register({ family: 'TimesPL-Italic', fonts: [{ src: 'https://fonts.gstatic.com/s/ptserif/v19/EJRTQgYoZZY2vCFuvAFTzro.ttf' }] })
}

export type CvFont = 'Helvetica' | 'Times-Roman' | 'Roboto'

export function getFontFamily(font: CvFont): string {
  if (font === 'Times-Roman') return 'TimesPL'
  if (font === 'Roboto') return 'Roboto'
  return 'HelveticaPL'
}

export function getBoldFont(font: CvFont): string {
  if (font === 'Times-Roman') return 'TimesPL-Bold'
  if (font === 'Roboto') return 'Roboto'
  return 'HelveticaPL-Bold'
}

export function getItalicFont(font: CvFont): string {
  if (font === 'Times-Roman') return 'TimesPL-Italic'
  if (font === 'Roboto') return 'Roboto'
  return 'HelveticaPL-Italic'
}

export function getBoldWeight(font: CvFont): number | undefined {
  if (font === 'Roboto') return 700
  return undefined
}

export function getItalicStyle(font: CvFont): string | undefined {
  if (font === 'Roboto') return 'italic'
  return undefined
}
