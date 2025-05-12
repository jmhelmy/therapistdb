'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const FILTERS = [
  'Gender',
  'Insurance',
  'Remote',
  'Degree',
  'Age',
  'Condition',
  'Price',
  'Faith',
  'Language',
  'Type of Therapy',
] as const;

type FilterKey = typeof FILTERS[number];

const FILTER_OPTIONS: Record<FilterKey, string[]> = {
  Gender: ['Female', 'Male', 'Non-Binary', 'Transgender'],
  Insurance: ['Aetna', 'Cigna', 'Blue Cross', 'Medicare', 'Medicaid'],
  Remote: ['Yes'],
  Degree: ['LMFT', 'LCSW', 'PsyD', 'PhD'],
  Age: ['Children', 'Teens', 'Adults', 'Elders'],
  Condition: ['Anxiety', 'Depression', 'PTSD', 'ADHD', 'Grief'],
  Price: ['< $100', '$100–150', '$150+'],
  Faith: ['Christian', 'Jewish', 'Spiritual', 'Muslim'],
  Language: ['English', 'Spanish', 'Tagalog', 'Arabic'],
  'Type of Therapy': ['cbt', 'dbt', 'emdr', 'psychodynamic', 'humanistic']
};

export default function ClientFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [zip, setZip] = useState(searchParams.get('zip') || '');
  const [filters, setFilters] = useState<Record<FilterKey, string>>(
    () =>
      FILTERS.reduce((acc, key) => {
        acc[key] = searchParams.get(key.toLowerCase()) || '';
        return acc;
      }, {} as Record<FilterKey, string>)
  );

  useEffect(() => {
    setZip(searchParams.get('zip') || '');
    setFilters(
      FILTERS.reduce((acc, key) => {
        acc[key] = searchParams.get(key.toLowerCase()) || '';
        return acc;
      }, {} as Record<FilterKey, string>)
    );
  }, [searchParams]);

  const handleSearch = async () => {
    const specialty = filters['Type of Therapy'];
    const trimmedZip = zip.trim();

    if (specialty && trimmedZip) {
      try {
        const res = await fetch(`/api/resolve-zip?zip=${trimmedZip}`);
        if (res.ok) {
          const loc = await res.json();
          const path = `/therapists/by/${specialty}/${loc.citySlug}${
            loc.neighborhoodSlug ? `/${loc.neighborhoodSlug}` : ''
          }`;
          router.push(path);
          return;
        }
      } catch (err) {
        console.error('ZIP resolution failed:', err);
      }
    }

    // fallback to query string
    const params = new URLSearchParams();
    if (trimmedZip) params.set('zip', trimmedZip);
    FILTERS.forEach((key) => {
      const value = filters[key];
      if (value) params.set(key.toLowerCase(), value);
    });
    router.push(`/therapists?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      {/* Zip input + Search button */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <input
          type="text"
          aria-label="Zip Code"
          placeholder="🔍 Zip Code"
          className="bg-[#f1f5f9] border border-gray-300 px-4 py-2 rounded-full text-gray-700 w-48 focus:outline-none"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-[#009CA6] text-white px-6 py-2 rounded-full text-sm hover:bg-[#007b85] transition"
        >
          Search
        </button>
      </div>

      {/* Dropdown filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {FILTERS.map((label) => {
          const value = filters[label];
          const isSelected = Boolean(value);
          const options = FILTER_OPTIONS[label];
          return (
            <select
              key={label}
              value={value}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [label]: e.target.value }))
              }
              className={
                `rounded-full px-4 py-2 text-sm focus:outline-none transition-colors duration-200 ` +
                (isSelected
                  ? 'bg-[#446179] text-white border-transparent'
                  : 'bg-white text-[#446179] border border-[#446179]')
              }
            >
              <option value="">{label}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          );
        })}
      </div>
    </div>
  );
}
