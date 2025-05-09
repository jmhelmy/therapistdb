// src/components/therapistProfile/ProfileHeader.tsx
import Image from 'next/image'
import Link from 'next/link'

export default function ProfileHeader({ therapist }: { therapist: any }) {
  const hasClaimed = Boolean(therapist.userId)
  return (
    <div className="relative text-center border border-gray-100 shadow-sm rounded-lg bg-white overflow-hidden">
      <div
        className="w-full h-32 rounded-t-lg"
        style={{ background: 'linear-gradient(135deg, #efe3d0 0%, #f9f7f2 100%)' }}
      />
      {!hasClaimed && (
        <Link href={`/claim/${therapist.id}`}>
          <button className="absolute top-4 right-4 border border-gray-300 px-3 py-1 text-sm rounded-full bg-white hover:bg-gray-100">
            Claim profile
          </button>
        </Link>
      )}
      <div className="relative -mt-12">
        <div className="w-28 h-28 rounded-full mx-auto border-4 border-white bg-white overflow-hidden">
          <Image
            src={therapist.imageUrl || '/default-avatar.png'}
            alt={`${therapist.name} avatar`}
            width={112}
            height={112}
            className="object-cover"
          />
        </div>
      </div>
      <div className="pb-6 px-4 mt-2">
        <div className="flex items-center justify-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900">{therapist.name}</h1>
          {hasClaimed && (
            <span className="inline-flex items-center text-green-600 text-sm font-medium">
              ✅ Verified
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">{[therapist.primaryCredential, therapist.primaryCredentialAlt].filter(Boolean).join(', ')}</p>
        {therapist.tagline && (
          <p className="text-sm text-gray-700 mt-1 max-w-md mx-auto">{therapist.tagline}</p>
        )}

        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          {therapist.phone && (
            <a
              href={`tel:${therapist.phone}`}
              className="flex-1 inline-flex justify-center items-center bg-teal-600 text-white py-2 rounded-full hover:bg-teal-700 text-sm"
            >
              📞 {therapist.phone}
            </a>
          )}
          {therapist.website && (
            <a
              href={therapist.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex justify-center items-center border border-teal-600 text-teal-600 py-2 rounded-full hover:bg-teal-50 text-sm"
            >
              website
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
