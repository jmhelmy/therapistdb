'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ZipSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [zip, setZip] = useState(searchParams.get('zip') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set('zip', zip);
    params.set('page', '1');
    router.push(`/therapists?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <input
        type="text"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        placeholder="Enter ZIP code"
        className="w-full p-3 border border-gray-300 rounded-md"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-teal-600 text-white rounded-md"
      >
        Search
      </button>
    </form>
  );
}
