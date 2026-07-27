import { NextResponse } from 'next/server'

// Wysylka e-mail tymczasowo WYLACZONA (decyzja: na razie nie wysylamy maili).
// Pelna implementacja przez Resend zachowana ponizej — do wlaczenia w przyszlosci
// (odkomentowac + ustawic env; rozwazyc darmowy Nodemailer+SMTP zamiast Resend).
export async function POST() {
  return NextResponse.json({ error: 'Wysylka e-mail jest tymczasowo wylaczona.' }, { status: 503 })
}

/*
import { Resend } from 'resend'

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Wysylka e-mail nie jest skonfigurowana (brak RESEND_API_KEY).' },
      { status: 500 }
    )
  }

  const from = process.env.CV_EMAIL_FROM || 'CVcraft <onboarding@resend.dev>'

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Nieprawidlowe dane zadania.' }, { status: 400 })
  }

  const { to, fileName, pdfBase64, configJson } = (body ?? {}) as {
    to?: string
    fileName?: string
    pdfBase64?: string
    configJson?: string
  }

  if (!to || !pdfBase64 || !configJson) {
    return NextResponse.json({ error: 'Brak wymaganych pol (to, pdfBase64, configJson).' }, { status: 400 })
  }

  const baseName = (fileName || 'cv').replace(/\.pdf$/i, '')
  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Twoje CV — ${baseName}`,
      text:
        'W zalaczniku znajdziesz swoje CV w formacie PDF oraz szablon (JSON), ktory mozesz ponownie zaimportowac w CVcraft, aby kontynuowac edycje.',
      attachments: [
        { filename: `${baseName}.pdf`, content: pdfBase64 },
        { filename: `${baseName}.json`, content: Buffer.from(configJson, 'utf-8').toString('base64') },
      ],
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Nie udalo sie wyslac wiadomosci.' }, { status: 500 })
  }
}
*/
