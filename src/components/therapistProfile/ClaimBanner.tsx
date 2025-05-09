// src/components/therapistProfile/ClaimBanner.tsx
import Link from 'next/link'

export default function ClaimBanner({ id }: { id: string }) {
  return (
    <div className="flex items-start gap-3 bg-purple-50 border border-purple-200 text-purple-900 px-6 py-4 rounded-lg">
      <span className="text-2xl leading-none">⚠️</span>
      <p className="text-sm">
        This profile is automatically generated using public data. It has not been verified
        by the therapist. If this is your profile, you can{' '}
        <Link href={`/claim/${id}`} className="underline font-medium">
          claim or remove it here
        </Link>.
      </p>
    </div>
  )
}
