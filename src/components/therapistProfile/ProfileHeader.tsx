// src/components/therapistProfile/ProfileHeader.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Phone, Globe, CheckBadgeIcon } from 'lucide-react'; // Example icons

// Define a specific type for the therapist prop based on selected fields
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
    // Add coverImageUrl if you fetch and use it
    // coverImageUrl?: string | null;
  };
}

export default function ProfileHeader({ therapist }: ProfileHeaderProps) {
  const isClaimedAndVerified = Boolean(therapist.userId); // Assuming userId means claimed & verified
  const [imageSrc, setImageSrc] = useState(therapist.imageUrl || '/default-avatar.png');
  // const [coverSrc, setCoverSrc] = useState(therapist.coverImageUrl || '/default-cover.jpg'); // If you have cover images

  const credentials = [therapist.primaryCredential, therapist.primaryCredentialAlt].filter(Boolean).join(', ');

  return (
    <div className="relative text-center border border-gray-200 shadow-lg rounded-xl bg-white overflow-hidden">
      {/* Cover Image Area */}
      <div
        className="w-full h-36 sm:h-48 bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-100"
        // style={coverSrc ? { backgroundImage: `url(${coverSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {/* If you have a cover image upload, you'd handle its display here */}
      </div>

      {/* Claim Button - only if not claimed */}
      {!isClaimedAndVerified && (
        <Link
          href={`/claim/${therapist.id}`} // Ensure this claim route exists
          className="absolute top-4 right-4 bg-white text-teal-700 px-4 py-1.5 text-xs font-semibold rounded-full shadow hover:bg-gray-50 transition-colors border border-gray-300"
        >
          Claim This Profile
        </Link>
      )}

      {/* Avatar */}
      <div className="relative -mt-16 sm:-mt-20 z-10">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
          <Image
            src={imageSrc}
            alt={`${therapist.name || 'Therapist'} - Profile Photo`}
            width={128} // Match container size
            height={128}
            className="object-cover w-full h-full"
            priority // This is likely the LCP for this page
            onError={() => setImageSrc('/default-avatar.png')}
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-4 pb-8 px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{therapist.name || "Therapist Profile"}</h1>
          {isClaimedAndVerified && (
            <span title="Verified Profile" className="flex items-center text-teal-600">
              <CheckBadgeIcon size={22} className="fill-current" />
              {/* Optional text: <span className="ml-1 text-xs font-medium">Verified</span> */}
            </span>
          )}
        </div>

        {credentials && (
          <p className="text-sm text-gray-500 mb-2">
            {credentials}
          </p>
        )}

        {therapist.tagline && (
          <p className="text-md text-gray-700 mt-2 mb-4 max-w-lg mx-auto italic">
            "{therapist.tagline}"
          </p>
        )}

        {/* Contact Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          {therapist.phone && (
            <a
              href={`tel:${therapist.phone.replace(/\D/g, '')}`} // Sanitize phone for tel: link
              className="flex-1 inline-flex justify-center items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-sm text-sm"
            >
              <Phone size={16} /> Call ({therapist.phone})
            </a>
          )}
          {therapist.website && (
            <a
              href={therapist.website.startsWith('http') ? therapist.website : `https://${therapist.website}`} // Ensure protocol
              target="_blank"
              rel="noopener noreferrer nofollow" // nofollow for external links often good
              className="flex-1 inline-flex justify-center items-center gap-2 border border-teal-600 text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors shadow-sm text-sm"
            >
              <Globe size={16} /> Visit Website
            </a>
          )}
        </div>
         {(!therapist.phone && !therapist.website && isClaimedAndVerified) && (
            <p className="text-sm text-gray-500 mt-4">Contact information available upon connection.</p>
         )}
         {!isClaimedAndVerified && !therapist.phone && !therapist.website && (
             <p className="text-sm text-gray-500 mt-4">Claim this profile to add contact details.</p>
         )}
      </div>
    </div>
  );
}