import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'], weight: ['400', '600'],
  variable: '--font-display', display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'], weight: ['300', '400', '500'],
  variable: '--font-body', display: 'swap',
})

export const metadata: Metadata = {
  title:       'Reportly — Informes de Meta Ads con IA',
  description: 'Genera informes profesionales de Meta Ads para tus clientes en 30 segundos. PDF con tu logo, dashboard en tiempo real.',
  keywords:    'reporting agencias marketing, meta ads reporting, informes automatizados, dashboard cliente',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-cream font-body text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
