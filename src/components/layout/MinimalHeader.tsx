// src/components/layout/MinimalHeader.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function MinimalHeader() {
  return (
    <header className="bg-white py-4 px-4 sm:px-6 lg:px-8 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto flex justify-center sm:justify-start"> {/* Center on mobile, start on larger screens */}
        <Link href="/" className="inline-flex items-center" aria-label="Go to homepage">
          <Image
            src="/logotherapistdb.png" // Ensure this path is correct (in your public folder)
            alt="TherapistDB Logo"
            width={36} // Slightly larger for a bit more presence
            height={36}
            priority // Good to prioritize logo loading
          />
          <span className="ml-2.5 text-xl font-bold text-gray-800 hover:text-teal-700 transition-colors">
            therapistdb
          </span>
        </Link>
      </div>
    </header>
  );
}