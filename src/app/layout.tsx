// src/app/layout.tsx

import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import ConditionalHeader from '@/components/ConditionalHeader'
import Providers from './providers'
import Script from 'next/script'

// Load Montserrat 500 and expose as a CSS variable
const montserrat = Montserrat({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Therapist DB',
  description: 'Find mental health professionals near you',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        {/* Load Cloudinary Upload Widget before hydration */}
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans bg-[#F9FAF9] antialiased">
        <Providers>
          <ConditionalHeader />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
