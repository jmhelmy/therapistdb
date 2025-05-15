// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
// REMOVE these direct imports if ConditionalLayoutWrapper handles them:
// import ConditionalHeader from '@/components/ConditionalHeader'; // OLD one, if you're replacing its logic
// import Footer from '@/components/shared/Footer';
import Providers from './providers'; // Keep this for NextAuth, etc.
import Script from 'next/script';
import ConditionalLayoutWrapper from '@/components/layout/ConditionalLayoutWrapper'; // IMPORT THE NEW WRAPPER

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
      <head>
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="beforeInteractive"
        />
        {/* Add any other head elements like favicons, etc. */}
      </head>
      <body className="flex flex-col min-h-screen font-sans bg-[#F9FAF9] antialiased">
        <Providers> {/* Providers should wrap everything that needs its context */}
          <ConditionalLayoutWrapper> {/* USE THE WRAPPER HERE */}
            {children} {/* Page content will be rendered inside <main> within the wrapper */}
          </ConditionalLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}