import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/theme'

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'CVcraft - Kreator CV',
  description: 'Stwórz profesjonalne CV w kilka minut. Wybierz szablon, uzupelnij dane i pobierz PDF.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pl"
      className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f4f5fc] dark:bg-[#07080f] relative overflow-hidden">

        {/* Background orbs */}
        <div
          aria-hidden
          className="cv-orb w-[500px] h-[500px] opacity-[0.11] dark:opacity-[0.16]"
          style={{ top: -130, left: -90, background: '#6c47ff' }}
        />
        <div
          aria-hidden
          className="cv-orb w-[360px] h-[360px] opacity-[0.08] dark:opacity-[0.12]"
          style={{ bottom: -60, right: '8%', background: '#06b6d4', animationDelay: '-9s' }}
        />
        <div
          aria-hidden
          className="cv-orb w-[260px] h-[260px] opacity-[0.07] dark:opacity-[0.10]"
          style={{ top: '42%', left: '38%', background: '#a855f7', animationDelay: '-5s' }}
        />

        <ThemeProvider>
          {/* Main content — EditorLayout renders its own topbar */}
          <main className="relative z-[1] flex flex-col flex-1 overflow-hidden min-h-0">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
