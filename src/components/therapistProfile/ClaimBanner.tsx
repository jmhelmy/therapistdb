// src/components/therapistProfile/ClaimBanner.tsx
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react'; // Using a more specific icon

interface ClaimBannerProps {
  therapistId: string;
  therapistName: string;
}

export default function ClaimBanner({ therapistId, therapistName }: ClaimBannerProps) {
  return (
    <div className="flex items-start gap-x-3 sm:gap-x-4 bg-amber-50 border-l-4 border-amber-400 text-amber-900 p-4 rounded-md shadow-sm my-6 print:hidden" role="alert">
      <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <h3 className="font-semibold text-amber-900">Information Notice</h3>
        <p className="text-sm mt-1">
          This profile was automatically generated using publicly available data and has not yet been verified by {therapistName}.
          If this is your profile, you can{' '}
          <Link href={`/claim/${therapistId}`} className="underline font-medium hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded">
            claim or manage it here
          </Link>.
        </p>
      </div>
    </div>
  );
}