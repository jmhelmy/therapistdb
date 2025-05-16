// src/components/therapistProfile/ProfileHeader.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Phone, Globe, CheckBadgeIcon as LucideCheckBadgeIcon, UserPlus } from 'lucide-react'; // Renamed for clarity

interface ProfileHeaderProps {
  therapist: {
    id: string;
    userId?: string | null;
    name?: string | null;
    tagline?: string | null;
    imageUrl?: string | null;
    phone?: string | null;
    website?: string | null;
    primaryCredential?: string | null;
    primaryCredentialAlt?: string | null;
  };
}

export default function ProfileHeader({ therapist }: ProfileHeaderProps) {
  const isClaimedAndVerified = Boolean(therapist.userId);
  const [imageSrc, setImageSrc] = useState(therapist.imageUrl || '/default-avatar.png'); // Ensure /default-avatar.png is in your public folder

  const credentials = [therapist.primaryCredential, therapist.primaryCredentialAlt].filter(Boolean).join(', ');

  return (
    <div className="relative text-center border border-gray-200 shadow-xl rounded-2xl bg-white overflow-hidden print:shadow-none">
      {/* Cover Image Placeholder */}
      <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-teal-100 via-sky-100 to-indigo-200 print:hidden" />

      {!isClaimedAndVerified && (
        <Link
          href={`/claim/${therapist.id}`}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white text-teal-700 px-3 py-1.5 sm:px-4 text-xs font-semibold rounded-full shadow-md hover:bg-teal-50 transition-colors border border-teal-200 flex items-center gap-1.5 z-20 print:hidden"
        >
          <UserPlus size={14} /> Claim Profile
        </Link>
      )}

      <div className="relative -mt-16 sm:-mt-20 z-10">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto border-4 sm:border-[6px] border-white bg-gray-200 overflow-hidden shadow-lg">
          <Image
            src={imageSrc}
            alt={`${therapist.name || 'Therapist'} - Profile Photo`}
            width={128}
            height={128}
            className="object-cover w-full h-full"
            priority
            onError={() => setImageSrc('/default-avatar.png')}
          />
        </div>
      </div>

      <div className="pt-4 pb-6 sm:pb-8 px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 mb-0.5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{therapist.name || "Therapist Profile"}</h1>
          {isClaimedAndVerified && (
            <span title="Verified Profile" className="flex items-center text-teal-500 shrink-0">
              <LucideCheckBadgeIcon size={24} className="fill-current" />
            </span>
          )}
        </div>

        {credentials && (
          <p className="text-sm sm:text-md text-gray-500 mb-2">
            {credentials}
          </p>
        )}

        {therapist.tagline && (
          <p className="text-sm sm:text-base text-gray-600 mt-2 mb-4 max-w-xl mx-auto italic">
            "{therapist.tagline}"
          </p>
        )}

        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
          {therapist.phone && (
            <a
              href={`tel:${therapist.phone.replace(/\D/g, '')}`}
              className="flex-1 w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow text-sm"
            >
              <Phone size={16} /> Call
            </a>
          )}
          {therapist.website && (
            <a
              href={therapist.website.startsWith('http') ? therapist.website : `https://${therapist.website}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex-1 w-full sm:w-auto inline-flex justify-center items-center gap-2 border border-teal-600 text-teal-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-50 transition-colors shadow-sm text-sm"
            >
              <Globe size={16} /> Website
            </a>
          )}
        </div>
         {(!therapist.phone && !therapist.website && isClaimedAndVerified) && (
            <p className="text-xs text-gray-500 mt-3">Contact information available upon connection.</p>
         )}
         {!isClaimedAndVerified && !therapist.phone && !therapist.website && (
             <p className="text-xs text-gray-500 mt-3">Claim this profile to add contact details.</p>
         )}
      </div>
    </div>
  );
}