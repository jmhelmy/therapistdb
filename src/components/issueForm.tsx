'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';

export default function IssueForm({ zip, page }: { zip?: string; page: number }) {
  const searchParams = useSearchParams();
  const [issue, setIssue] = useState<string>(searchParams.get('issue') || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => setIsLoading(false), 30000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const qs = new URLSearchParams();
    if (zip) qs.set('zip', zip);
    qs.set('page', String(page));
    if (issue) qs.set('issue', issue);

    const url = `/therapists?${qs.toString()}`;

    // Force full server-side reload
    window.location.href = url;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 mb-4 w-full">
      <textarea
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        rows={3}
        placeholder="Describe the issue you’re having…"
        className="w-full p-4 border border-gray-300 rounded-lg resize-none min-h-[80px]"
      />
      <div className="flex justify-between items-center mt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition disabled:opacity-50"
        >
          {isLoading ? 'Thinking...' : <span className="text-lg">➤</span>}
        </button>
        {isLoading && (
          <p className="text-sm text-gray-500 italic">Analyzing your input with AI…</p>
        )}
      </div>
    </form>
  );
}
