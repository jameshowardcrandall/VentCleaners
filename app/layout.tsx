import { Analytics } from '@vercel/analytics/next'
import { DM_Sans, Outfit } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata = {
  title: 'Vent Cleaners - Professional Dryer Vent Cleaning | Prevent Fires & Save Energy',
  description: 'Professional dryer vent cleaning service. Prevent fires, reduce energy bills, and extend dryer life. Same-day service available. Licensed & insured.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${outfit.variable}`}>
      <body className="font-sans bg-background antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
