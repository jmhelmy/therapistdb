// components/TherapistList/IssueForm.tsx (assuming this is the correct path based on your error)
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function IssueForm({ zip, page }: { zip?: string; page: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [issue, setIssue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initialIssueSet = useRef(false);

  useEffect(() => {
    if (!initialIssueSet.current) {
      setIssue(searchParams.get('issue') || '');
      initialIssueSet.current = true;
    }
  }, [searchParams]); // Only re-run if searchParams object reference changes

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        console.warn("AI processing timed out for issue search.");
      }, 30000);
    }
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const currentIssueInParams = searchParams.get('issue') || '';
    const newIssueTrimmed = issue.trim();

    // Prevent submission if no actual change to the issue filter
    if (newIssueTrimmed === currentIssueInParams) {
      if (newIssueTrimmed === '') { // Both are empty, nothing to do
        return;
      }
      // Both are the same non-empty issue, also nothing to do
      return;
    }

    setIsLoading(true);
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

    // Preserve existing zip if passed as a prop
    if (zip) {
        currentParams.set('zip', zip);
    } else {
        // If no zip prop, remove it if it was in currentParams from URL to avoid conflicts
        // Or, decide if you want to keep existing URL zip. For now, let's assume zip prop is authoritative.
        if(!currentParams.has('zip') && zip === undefined) {
            // no zip prop, no zip in url, fine.
        } else if (zip === undefined) {
             currentParams.delete('zip'); // if zip prop is not given, don't force a zip
        }
    }


    if (newIssueTrimmed) {
      currentParams.set('issue', newIssueTrimmed);
    } else {
      currentParams.delete('issue'); // Clear the issue if textarea is empty
    }
    currentParams.set('page', '1'); // Always reset to page 1 when issue filter changes

    const url = `/therapists?${currentParams.toString()}`;
    router.push(url);
    // setIsLoading(false); // Let page navigation handle this
  };

  // The comment block was here. Removing it or ensuring clean separation.
  // It's generally fine, but if there was a hidden character or odd linting, it could be an issue.

  return (
    <form onSubmit={handleSubmit} className="w-full mt-4 mb-8">
      <div className="relative">
        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          rows={3}
          placeholder="Describe the issue you’re having for a more personalized match..."
          className="w-full p-4 pr-16 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 transition-colors"
          aria-label="Describe your issue for AI matching"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || (issue.trim() === (searchParams.get('issue') || '') && issue.trim() !== '')}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 p-2.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
          aria-label={isLoading ? "Refining search with your issue" : "Refine search by issue"}
        >
          {isLoading
            ? <Loader2 size={20} className="animate-spin" />
            : <Search size={20} />
          }
        </button>
      </div>

      {isLoading && (
        <p className="mt-2 text-xs text-center text-gray-500 italic">
          <Loader2 size={14} className="inline mr-1 animate-spin" />
          Refining matches based on your input…
        </p>
      )}
    </form>
  );
}