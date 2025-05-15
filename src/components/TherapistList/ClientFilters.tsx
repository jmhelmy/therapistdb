// components/ClientFilters.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Search, MapPin, Filter as FilterIcon } from 'lucide-react'; // Example icons

const FILTERS = [
  'Gender', 'Insurance', 'Remote', 'Degree', 'Age', 'Condition',
  'Price', 'Faith', 'Language', 'Type of Therapy',
] as const;

type FilterKey = typeof FILTERS[number];

const FILTER_KEY_MAP: Record<FilterKey, string> = {
  'Gender': 'gender', 'Insurance': 'insurance', 'Remote': 'remote', 'Degree': 'degree',
  'Age': 'age', 'Condition': 'condition', 'Price': 'price', 'Faith': 'faith',
  'Language': 'language', 'Type of Therapy': 'treatmentStyle',
};

// Consider making these options more comprehensive or fetching them dynamically if they change often
const FILTER_OPTIONS: Record<FilterKey, string[]> = {
  Gender: ['Female', 'Male', 'Non-Binary', 'Transgender', 'Prefer not to say'],
  Insurance: ['Aetna', 'Cigna', 'Blue Cross Blue Shield', 'UnitedHealthcare', 'Medicare', 'Medicaid', 'Out of Network'],
  Remote: ['Yes', 'No'], // Added 'No' for explicit filtering
  Degree: ['LMFT', 'LCSW', 'LPCC', 'PsyD', 'PhD', 'MD (Psychiatrist)'],
  Age: ['Children (0-12)', 'Teens (13-17)', 'Young Adults (18-25)', 'Adults (26-64)', 'Seniors (65+)'],
  Condition: ['Anxiety', 'Depression', 'Trauma & PTSD', 'ADHD', 'Grief & Loss', 'Relationship Issues', 'Stress Management', 'OCD', 'Bipolar Disorder'],
  Price: ['<$100 per session', '$100 - $150', '$150 - $200', '$200+ per session'],
  Faith: ['Christian', 'Jewish', 'Muslim', 'Buddhist', 'Hindu', 'Spiritual but not religious', 'Agnostic', 'Atheist', 'No Preference'],
  Language: ['English', 'Spanish', 'Mandarin', 'French', 'German', 'ASL (American Sign Language)'],
  'Type of Therapy': ['Cognitive Behavioral (CBT)', 'Dialectical (DBT)', 'EMDR', 'Psychodynamic', 'Humanistic', 'Existential', 'Mindfulness-based', 'Solution-Focused'],
};

export default function ClientFilters() {
  const searchParams = useSearchParams();
  const zip = searchParams.get('zip') || '';

  return (
    <form
      action="/therapists" // Submits to the therapist search page
      method="GET" // GET method is appropriate for filters as it updates URL
      className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10 border border-gray-200"
    >
      {/* Section 1: ZIP Code Search - More prominent */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 pb-6 border-b border-gray-200">
        <label htmlFor="zip-filter" className="flex items-center text-lg font-semibold text-gray-700 whitespace-nowrap">
          <MapPin size={22} className="mr-2 text-teal-600" />
          Find by Location
        </label>
        <div className="flex w-full sm:w-auto items-center gap-2 bg-slate-100 rounded-full border border-slate-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all px-1 py-1">
          <input
            id="zip-filter"
            type="text"
            name="zip"
            defaultValue={zip}
            aria-label="Enter ZIP Code"
            placeholder="Enter ZIP Code"
            className="flex-grow appearance-none bg-transparent text-gray-700 py-2 px-3 leading-tight focus:outline-none placeholder-gray-500 text-sm sm:min-w-[180px]"
            pattern="\d{5}(-\d{4})?"
            title="Enter a 5-digit or 9-digit ZIP code."
          />
          <button
            type="submit"
            aria-label="Search by ZIP code"
            className="bg-teal-600 text-white p-2.5 rounded-full hover:bg-teal-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Section 2: Dropdown Filters - More organized */}
      <div className="mb-4 flex items-center">
        <FilterIcon size={20} className="mr-2 text-teal-600"/>
        <h3 className="text-lg font-semibold text-gray-700">Refine Your Search</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {FILTERS.map((label) => {
          const key = FILTER_KEY_MAP[label];
          const currentValue = searchParams.get(key) || '';

          return (
            <div key={label} className="relative">
              <select
                name={key}
                defaultValue={currentValue}
                aria-label={`Filter by ${label}`}
                onChange={(e) => {
                  // Auto-submit the form when a filter changes
                  // Ensure the form element is correctly targeted
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    form.requestSubmit();
                  }
                }}
                className={`w-full appearance-none rounded-md border py-2.5 pl-3 pr-8 text-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm ${
                  currentValue
                    ? 'bg-teal-600 text-white border-teal-600 font-medium' // Active state
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400' // Inactive state
                }`}
              >
                <option value="" className={currentValue ? "text-gray-500 bg-white" : ""}>{label}</option> {/* Label as default option */}
                {FILTER_OPTIONS[label].map((opt) => (
                  <option key={opt} value={opt} className="text-gray-700 bg-white">
                    {opt}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${currentValue ? 'text-white' : 'text-gray-700'}`}>
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
       {/* Optional: Clear Filters Button */}
       {Array.from(searchParams.keys()).some(key => FILTERS.map(f => FILTER_KEY_MAP[f]).includes(key) && searchParams.get(key) !== '') && (
        <div className="mt-6 text-center sm:text-right">
          <a // Use an <a> tag to navigate, effectively clearing filters for these specific keys
            href={`/therapists${zip ? '?zip=' + zip : ''}`} // Preserve ZIP if present, clear others
            className="text-sm text-teal-600 hover:text-teal-700 hover:underline"
          >
            Clear All Filters
          </a>
        </div>
      )}
    </form>
  );
}