// src/components/therapistProfile/ProfileHeader.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Phone, Globe, CheckBadgeIcon as LucideCheckBadgeIcon, UserPlus, MapPin, Video, Users as UsersIcon } from 'lucide-react';

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
    primaryCity?: string | null;
    primaryState?: string | null;
    telehealth?: boolean | null;
    inPerson?: boolean | null;
  };
  // Removed accent color props as we are not doing a full theme change for now
}

export default function ProfileHeader({ therapist }: ProfileHeaderProps) {
  const isClaimedAndVerified = Boolean(therapist.userId);
  const [imageSrc, setImageSrc] = useState(therapist.imageUrl || '/default-avatar.png');

  const credentials = [therapist.primaryCredential, therapist.primaryCredentialAlt].filter(Boolean).join(', ');
  const locationString = [therapist.primaryCity, therapist.primaryState].filter(Boolean).join(', ');

  return (
    <div className="relative text-center border border-gray-200 shadow-xl rounded-2xl bg-white overflow-hidden print:shadow-none">
      {/* UPDATED COVER IMAGE BACKGROUND */}
      <div 
        className="w-full h-36 sm:h-44 print:hidden"
        style={{ backgroundColor: '#F1E9D5' }} // Using inline style for the specific beige
        // Or, if you add to tailwind.config.js: className="bg-brand-beige-light"
      >
        {/* You could add a very subtle pattern or texture here if desired via CSS background-image */}
      </div>

      {!isClaimedAndVerified && (
        <Link
          href={`/claim/${therapist.id}`}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white text-teal-700 px-3 py-1.5 sm:px-4 text-xs font-semibold rounded-full shadow-md hover:bg-teal-50 transition-colors border border-teal-200 flex items-center gap-1.5 z-20 print:hidden"
        >
          <UserPlus size={14} /> Claim Profile
        </Link>
      )}

      <div className="relative -mt-16 sm:-mt-20 z-10">
        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full mx-auto border-4 sm:border-[6px] border-white bg-gray-200 overflow-hidden shadow-lg">
          <Image
            src={imageSrc}
            alt={`${therapist.name || 'Therapist'} - Profile Photo`}
            width={144}
            height={144}
            className="object-cover w-full h-full"
            priority
            onError={() => setImageSrc('/default-avatar.png')}
          />
        </div>
      </div>

      <div className="pt-4 pb-6 sm:pb-8 px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          {/* Increased font size for name */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">{therapist.name || "Therapist Profile"}</h1>
          {isClaimedAndVerified && (
            <span title="Verified Profile" className="flex items-center text-teal-500 shrink-0"> {/* Kept teal for verified badge */}
              <LucideCheckBadgeIcon size={26} className="fill-current" />
            </span>
          )}
        </div>

        {credentials && (
          // Increased font size for credentials
          <p className="text-base sm:text-lg text-gray-600 mb-2">
            {credentials}
          </p>
        )}

        {/* Location and Availability Info */}
        <div className="mt-2 mb-3 sm:mb-4 text-sm sm:text-base text-gray-500 space-y-1"> {/* Base size for this info */}
          
          <div className="flex items-center justify-center gap-x-4 gap-y-1"> {/* Increased gap for clarity */}
            {therapist.telehealth && (
              <div className="flex items-center gap-1.5">
                <Video size={16} className="shrink-0 text-teal-600" /> {/* Teal icon for positive attribute */}
                <span>Teletherapy offered</span>
              </div>
            )}
            {therapist.inPerson && (
              <div className="flex items-center gap-1.5">
                <UsersIcon size={16} className="shrink-0 text-blue-600" /> {/* Blue icon for in-person */}
                <span>In-Person Offered</span>
              </div>
            )}
            {locationString && (
            <div className="flex items-center justify-center gap-1.5">
              <MapPin size={16} className="shrink-0" />
              <span>{locationString}</span>
            </div>
          )}
          </div>
        </div>

        {therapist.tagline && (
          // Increased font size for tagline
          <p className="text-base sm:text-lg text-gray-700 mt-3 mb-5 max-w-xl mx-auto italic">
            "{therapist.tagline}"
          </p>
        )}

        {/* Buttons - kept original teal accent, increased font size */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          {therapist.phone && (
            <a
              href={`tel:${therapist.phone.replace(/\D/g, '')}`}
              className="flex-1 w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow text-sm sm:text-base" // text-sm sm:text-base
            >
              <Phone size={18} /> Call
            </a>
          )}
          {therapist.website && (
            <a
              href={therapist.website.startsWith('http') ? therapist.website : `https://${therapist.website}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex-1 w-full sm:w-auto inline-flex justify-center items-center gap-2 border border-teal-600 text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors shadow-sm text-sm sm:text-base" // text-sm sm:text-base
            >
              <Globe size={18} /> Website
            </a>
          )}
        </div>
         {/* ... (contact info notices - keep as is) ... */}
      </div>
    </div>
  );
}