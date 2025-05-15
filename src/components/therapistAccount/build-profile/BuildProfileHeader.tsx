// src/components/therapistAccount/build-profile/BuildProfileHeader.tsx
'use client';

import Link from 'next/link';
// Uncomment if you use useSession from next-auth/react
// import { useSession } from 'next-auth/react';
// Uncomment if you use lucide-react icons
// import { User, MoreVertical } from 'lucide-react';
import PublishButton from './PublishButton'; // Assuming PublishButton is in the same directory

type Props = {
  formDataForHeader: {
    id?: string;
    name?: string;
    published?: boolean;
    slug?: string;
  };
  onUnpublish: () => void; // Function to call when "Unpublish" is clicked
  previewUrl: string;      // URL for the preview link
};

export default function BuildProfileHeader({
  formDataForHeader,
  onUnpublish,
  previewUrl,
}: Props) {
  // const { data: session } = useSession(); // Example: if you need session data

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 sm:px-6 py-3 sm:py-4">
      {/* Left side: Link to Account or a User Icon */}
      <Link href="/account" aria-label="Go to your account page">
        {/* Option 1: Icon (if you have lucide-react or similar) */}
        {/* <User className="w-6 h-6 text-gray-600 hover:text-teal-600 transition-colors" /> */}

        {/* Option 2: Placeholder SVG Icon for User */}
        <svg
          className="w-6 h-6 text-gray-600 hover:text-teal-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
      </Link>

      {/* Center: Title and Preview Link */}
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
        <h1 className="text-md sm:text-lg font-semibold text-gray-800">
          Edit Profile
        </h1>
        {previewUrl && previewUrl !== '#' && (
          <Link
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-teal-600 hover:text-teal-700 hover:underline"
          >
            Preview
          </Link>
        )}
      </div>

      {/* Right side: Publish Button and Options Menu */}
      <div className="relative flex items-center">
        <PublishButton /> {/* This component now uses useFormContext */}
        {formDataForHeader.published && (
          <details className="relative inline-block ml-2 group">
            {/* Using <details> for better accessibility and native behavior */}
            <summary
              className="list-none cursor-pointer p-2 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              aria-label="Profile options"
            >
              {/* Option 1: Icon (if you have lucide-react or similar) */}
              {/* <MoreVertical className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" /> */}

              {/* Option 2: Placeholder SVG Icon for More Options */}
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"></path>
              </svg>
            </summary>
            <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden">
              <li>
                <button
                  type="button" // Important for buttons inside a form structure
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors focus:outline-none focus-visible:bg-gray-100"
                  onClick={() => {
                    onUnpublish();
                    // Close the details dropdown if needed (can be tricky with <details>)
                    const detailsElement = document.querySelector('details.group'); // A bit hacky, better to manage state if complex
                    if (detailsElement) detailsElement.removeAttribute('open');
                  }}
                >
                  Unpublish Profile
                </button>
              </li>
              {/* You can add more list items here for other actions */}
              {/* Example:
              <li>
                <Link
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                >
                  View Live Profile
                </Link>
              </li>
              */}
            </ul>
          </details>
        )}
      </div>
    </header>
  );
}