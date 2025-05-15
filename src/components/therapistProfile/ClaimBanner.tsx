// src/components/therapistProfile/ClaimBanner.tsx
import Link from 'next/link';

interface ClaimBannerProps {
  therapistId: string; // Renamed from id for clarity
  therapistName: string; // To personalize the message slightly
}

export default function ClaimBanner({ therapistId, therapistName }: ClaimBannerProps) {
  return (
    <div className="flex items-start gap-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md shadow-sm my-6" role="alert">
      <span className="text-xl leading-none mt-0.5">
        {/* Consider a more specific icon, e.g., from lucide-react */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-yellow-500">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </span>
      <div>
        <h3 className="font-semibold">Information Notice</h3>
        <p className="text-sm mt-1">
          This profile was automatically generated using publicly available data and has not yet been verified by {therapistName}.
          If this is your profile, you can{' '}
          <Link href={`/claim/${therapistId}`} className="underline font-medium hover:text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded">
            claim or manage it here
          </Link>.
        </p>
      </div>
    </div>
  );
}