// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Providers from './providers';
import ConditionalLayoutWrapper from '@/components/layout/ConditionalLayoutWrapper'; // Assuming path is correct
import CloudinaryScriptLoader from '@/components/shared/CloudinaryScriptLoader'; // Import the new component

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
        {/* Cloudinary script is now loaded by CloudinaryScriptLoader inside Providers */}
      </head>
      <body className="flex flex-col min-h-screen font-sans bg-[#F9FAF9] antialiased">
        <Providers> {/* NextAuth Provider, etc. */}
          <CloudinaryScriptLoader /> {/* Place the script loader here */}
          <ConditionalLayoutWrapper>
            {children}
          </ConditionalLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}