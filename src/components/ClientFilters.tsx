// components/ClientFilters.tsx
'use client';

import { useSearchParams } from 'next/navigation';

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

const FILTER_KEY_MAP: Record<FilterKey, string> = {
  Gender: 'gender',
  Insurance: 'insurance',
  Remote: 'remote',
  Degree: 'degree',
  Age: 'age',
  Condition: 'condition',
  Price: 'price',
  Faith: 'faith',
  Language: 'language',
  'Type of Therapy': 'treatmentStyle',
};

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
  'Type of Therapy': ['cbt', 'dbt', 'emdr', 'psychodynamic', 'humanistic'],
};

export default function ClientFilters() {
  const searchParams = useSearchParams();
  const zip = searchParams.get('zip') || '';

  return (
    <form
      action="/therapists"
      method="get"
      className="bg-white rounded-xl shadow-sm p-6 mb-8"
    >
      {/* Zip + Submit */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <input
          type="text"
          name="zip"
          defaultValue={zip}
          aria-label="Zip Code"
          placeholder="🔍 Zip Code"
          className="bg-[#f1f5f9] border border-gray-300 px-4 py-2 rounded-full text-gray-700 w-48 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#009CA6] text-white px-6 py-2 rounded-full text-sm hover:bg-[#007b85] transition"
        >
          Search
        </button>
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {FILTERS.map((label) => {
          const key = FILTER_KEY_MAP[label];
          const currentValue = searchParams.get(key) || '';

          return (
            <select
              key={label}
              name={key}
              defaultValue={currentValue}
              onChange={(e) => e.target.form?.requestSubmit()}
              className={`rounded-full px-4 py-2 text-sm focus:outline-none transition-colors duration-200 ${
                currentValue
                  ? 'bg-[#446179] text-white border-transparent'
                  : 'bg-white text-[#446179] border border-[#446179]'
              }`}
            >
              <option value="">{label}</option>
              {FILTER_OPTIONS[label].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          );
        })}
      </div>
    </form>
  );
}
