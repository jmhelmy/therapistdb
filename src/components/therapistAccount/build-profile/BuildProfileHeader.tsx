// src/components/therapistAccount/build-profile/BuildProfileHeader.tsx
'use client';

import Link from 'next/link';
import { User, Eye, MoreVertical, LogOut, Settings, CheckCircle } from 'lucide-react'; // Import necessary icons
import PublishButton from './PublishButton'; // This component handles its own logic

type Props = {
  formDataForHeader: {
    id?: string; // Used by PublishButton internally
    name?: string; // Used by PublishButton internally
    published?: boolean;
    slug?: string;
  };
  onUnpublish: () => void;
  previewUrl: string;
  // Optional: Add a prop if there's a general "save draft" action distinct from "Save & Continue"
  // onSaveDraft?: () => Promise<void>;
  // isSavingDraft?: boolean;
};

export default function BuildProfileHeader({
  formDataForHeader,
  onUnpublish,
  previewUrl,
  // onSaveDraft,
  // isSavingDraft
}: Props) {

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-3">
      {/* Left side: Link to Account */}
      <Link
        href="/account"
        aria-label="Back to your account"
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
      >
        <User className="w-5 h-5 sm:w-6 sm:h-6" />
      </Link>

      {/* Center: Title and Preview Link */}
      <div className="flex flex-col items-center">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
          Edit Your Profile
        </h1>
        {previewUrl && previewUrl !== '#' && (
          <Link
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs sm:text-sm text-teal-600 hover:text-teal-700 hover:underline mt-0.5"
          >
            <Eye size={14} className="mr-1" />
            Preview Profile
          </Link>
        )}
      </div>

      {/* Right side: Publish Button and Options Menu */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Optional Save Draft button if needed
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSavingDraft}
            className="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            {isSavingDraft ? 'Saving...' : 'Save Draft'}
          </button>
        )}
        */}

        {/* PublishButton handles its own internal loading state */}
        <PublishButton />

        {formDataForHeader.published && (
          <div className="relative"> {/* Changed details to div for more control with state */}
            <details className="group"> {/* Use group for styling based on open state if needed */}
                <summary
                    className="list-none flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-teal-500 focus:outline-none"
                    aria-label="More profile options"
                >
                    <MoreVertical className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                </summary>
                <ul className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-xl z-20 py-1">
                <li>
                    <Link
                    href={previewUrl} // Assuming previewUrl is the live profile URL when published
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                    >
                    <Eye size={16} className="mr-2.5" /> View Live Profile
                    </Link>
                </li>
                <li>
                    <button
                    type="button"
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => {
                        onUnpublish();
                        // Programmatic closing of <details> is tricky; usually relies on user clicking summary again
                        // Or manage open state with useState if more control is needed.
                        const detailsElement = (document.activeElement as HTMLElement)?.closest('details');
                        if (detailsElement) detailsElement.removeAttribute('open');
                    }}
                    >
                    <LogOut size={16} className="mr-2.5 text-red-500" /> Unpublish Profile
                    </button>
                </li>
                {/* Example: Link to account settings */}
                {/* <li>
                    <Link
                    href="/account/settings"
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                    >
                    <Settings size={16} className="mr-2.5" /> Account Settings
                    </Link>
                </li> */}
                </ul>
            </details>
          </div>
        )}
         {!formDataForHeader.published && formDataForHeader.id && ( /* Show green check if saved but not published */
            <CheckCircle size={20} className="text-green-500 ml-2" title="Profile draft saved"/>
         )}
      </div>
    </header>
  );
}