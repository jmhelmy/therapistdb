// src/components/home/BrowseByState.tsx
'use client'; // Keep as client component if no server-side data fetching needed here
              // Or make server component if states list becomes dynamic/fetched

import Link from 'next/link'; // Use Next.js Link for client-side navigation

// Expanded list of states for better SEO coverage.
// Consider moving this to a shared data file if used elsewhere.
const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
  // Optionally add territories like 'District of Columbia', 'Puerto Rico' etc.
];

function slugifyState(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export default function BrowseByState() {
  return (
    <section className="py-16 md:py-20 px-4 bg-slate-100"> {/* Slightly different background for visual rhythm */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10 text-center text-gray-800">
          Browse Therapists by State
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {states.map((state) => {
            const stateSlug = slugifyState(state);
            // Constructing a URL like /therapists/us/california or /therapists?state=california
            // The URL structure depends on how your [state] pages or search filters are set up.
            // Option 1: Dynamic route like /therapists/[country]/[state]
            // const href = `/therapists/us/${stateSlug}`;
            // Option 2: Query parameter like /therapists?state=california
            const href = `/therapists?state=${stateSlug}`; // Using query param for this example

            return (
              <Link
                key={state}
                href={href}
                className="block text-center bg-white border border-gray-200 rounded-lg py-4 px-2 text-gray-700 text-sm font-medium hover:bg-teal-50 hover:border-teal-300 hover:text-teal-600 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
              >
                {state}
              </Link>
            );
          })}
        </div>
        {/* Optional: Link to a page listing all states or more advanced search */}
        {/*
        <div className="text-center mt-10">
          <Link href="/states" className="text-teal-600 hover:underline font-medium">
            View All States & Territories
          </Link>
        </div>
        */}
      </div>
    </section>
  );
}