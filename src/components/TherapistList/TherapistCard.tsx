// components/TherapistList/TherapistCard.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// This type defines what data TherapistCard expects.
// It should be derived from the fields selected in `TherapistsPage.tsx`
export type TherapistDataForCard = {
  id: string;
  slug: string;
  name?: string | null;
  imageUrl?: string | null;
  primaryCredential?: string | null;
  primaryCredentialAlt?: string | null;
  tagline?: string | null;
  feeIndividual?: string | null; // From CSV, likely string
  feeCouples?: string | null;   // From CSV, likely string
  slidingScale?: boolean | null;
  paymentMethods?: string[] | null;
  insuranceAccepted?: string | null;
  primaryCity?: string | null;
  primaryState?: string | null;
  primaryZip?: string | null;
  languages?: string[] | null;
  issues?: string[] | null; // "Clients Concerns I treat"
  // Add any other fields you display directly in the card
};

export type TherapistCardComponentProps = {
  therapist: TherapistDataForCard;
};

export default function TherapistCard({ therapist: t }: TherapistCardComponentProps) {
  const [imageSrc, setImageSrc] = useState(t.imageUrl || '/default-avatar.png');

  // Helper to display N/A for empty strings or null values
  const displayValue = (value: string | null | undefined, fallback = 'N/A') => value || fallback;

  return (
    <Link
      href={`/therapists/${t.slug}`}
      className="block hover:shadow-lg transition-shadow duration-200 rounded-xl"
    >
      <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row gap-5 items-start border border-gray-200 hover:border-teal-300">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0 mx-auto sm:mx-0 shadow-md">
          <Image
            src={imageSrc}
            alt={`${t.name || 'Therapist'}'s avatar`}
            width={96}
            height={96}
            className="object-cover w-full h-full"
            priority={false}
            onError={() => setImageSrc('/default-avatar.png')}
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{t.name || 'Unnamed Therapist'}</h3>
          <p className="text-sm text-teal-600 font-medium mb-2">
            {t.primaryCredential}
            {t.primaryCredentialAlt && `, ${t.primaryCredentialAlt}`}
          </p>
          {t.tagline && <p className="text-md text-gray-700 mb-3 italic">"{displayValue(t.tagline)}"</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
            <div><strong>Individual Fee:</strong> {displayValue(t.feeIndividual)}</div>
            <div><strong>Couples Fee:</strong> {displayValue(t.feeCouples)}</div>
            {t.slidingScale && <div className="text-green-600 font-medium">✓ Sliding Scale</div>}
            <div><strong>Insurance:</strong> {displayValue(t.insuranceAccepted)}</div>
          </div>

          <p className="text-sm text-gray-600 mb-1">
            <strong>Location:</strong> {displayValue(t.primaryCity, 'N/A')}, {displayValue(t.primaryState, '')} {displayValue(t.primaryZip, '')}
          </p>
          {(t.languages && t.languages.length > 0) &&
            <p className="text-sm text-gray-600 mb-1"><strong>Languages:</strong> {t.languages.join(', ')}</p>
          }
          {(t.issues && t.issues.length > 0) &&
            <p className="text-sm text-gray-600"><strong>Specializes in:</strong> {t.issues.slice(0, 4).join(', ')}{t.issues.length > 4 ? '...' : ''}</p>
          }
          {(t.paymentMethods && t.paymentMethods.length > 0) &&
            <p className="text-xs text-gray-500 mt-2">Payment Methods: {t.paymentMethods.join(', ')}</p>
          }
        </div>
      </div>
    </Link>
  );
}