'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type Props = {
  therapist: {
    id: string
    slug: string
    name: string
    imageUrl?: string
    primaryCredential?: string
    primaryCredentialAlt?: string
    tagline?: string
    feeIndividual?: string
    feeCouples?: string
    slidingScale?: boolean
    paymentMethods: string[]
    insuranceAccepted?: string
    primaryCity?: string
    primaryState?: string
    primaryZip?: string
    languages: string[]
    issues: string[]
  }
}

export default function TherapistCard({ therapist: t }: { therapist: Props['therapist'] }) {
  const [imageSrc, setImageSrc] = useState(t.imageUrl || '/default-avatar.png')

  return (
    <Link
      href={`/therapists/${t.slug}`}
      className="block hover:shadow-md transition-shadow duration-200 rounded-xl"
    >
      <div className="bg-white rounded-xl shadow-md p-6 flex gap-5 items-start border border-gray-100">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
          <Image
            src={imageSrc}
            alt={`${t.name} avatar`}
            width={64}
            height={64}
            className="object-cover w-full h-full"
            loading="lazy"
            onError={() => setImageSrc('/default-avatar.png')}
          />
        </div>
        {/* Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {t.primaryCredential}
            {t.primaryCredentialAlt && `, ${t.primaryCredentialAlt}`}
          </p>
          {t.tagline && <p className="text-sm text-gray-800 mb-2">{t.tagline}</p>}
          <div className="text-sm text-gray-700 space-y-1 mb-2">
            <p><strong>Individual Fee:</strong> {t.feeIndividual || 'N/A'}</p>
            <p><strong>Couples Fee:</strong> {t.feeCouples || 'N/A'}</p>
            {t.slidingScale && <p className="text-green-700">✅ Sliding Scale</p>}
          </div>
          <div className="text-sm text-gray-700 space-y-1 mb-2">
            <p><strong>Payment Methods:</strong> {t.paymentMethods?.join(', ') || 'N/A'}</p>
            <p><strong>Insurance:</strong> {t.insuranceAccepted || 'N/A'}</p>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Location:</strong> {t.primaryCity || '—'}, {t.primaryState || '—'} {t.primaryZip || ''}
          </p>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Languages:</strong> {t.languages?.join(', ') || 'N/A'}</p>
            <p><strong>Issues:</strong> {t.issues?.join(', ') || 'N/A'}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
