// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import ConditionalHeader from '@/components/ConditionalHeader';
import Footer from '@/components/shared/Footer';
import Providers from './providers';
import Script from 'next/script';

const montserrat = Montserrat({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TherapistDB | Find Your Ideal Mental Health Professional',
  description: 'Easily find and connect with licensed therapists, counselors, and psychologists near you or online. Search by specialty, location, and more on TherapistDB.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full`}>
      {/* Ensure <head> immediately follows or is on the same line if preferred */}
      <head>
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="beforeInteractive"
        />
        {/* Add any other head elements like favicons, etc. */}
      </head>
      {/* Ensure <body> immediately follows </head> */}
      <body className="flex flex-col min-h-screen font-sans bg-[#F9FAF9] antialiased">
        <Providers>
          <ConditionalHeader />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}